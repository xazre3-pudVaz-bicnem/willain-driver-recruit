/**
 * 生成コラムJSONの検証。
 * 1) parseColumnJson: モデル出力を厳格スキーマ（zod）でパース（失敗時は1回だけ再依頼）
 * 2) validateGenerated: 品質・安全・求人整合・内部リンク・出典のチェック
 *
 * 重複（カニバリ）判定はコーパスが必要なため generator 側で行う。
 */

import { z } from "zod";

/* ------------------------------ スキーマ ------------------------------ */

const SubsectionSchema = z.object({
  heading: z.string().min(1),
  content: z.string().min(1),
});

const SectionSchema = z.object({
  heading: z.string().min(1),
  content: z.string().min(1),
  subsections: z.array(SubsectionSchema).optional().default([]),
});

const FaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const GeneratedColumnSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  introduction: z.string().min(1),
  sections: z.array(SectionSchema).min(1),
  checklist: z.array(z.string()).optional().default([]),
  faq: z.array(FaqSchema).optional().default([]),
  relatedJobSlugs: z.array(z.string()).optional().default([]),
  relatedArticleSlugs: z.array(z.string()).optional().default([]),
  sourceIds: z.array(z.string()).optional().default([]),
});

export type GeneratedColumn = z.infer<typeof GeneratedColumnSchema>;

export class ColumnParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ColumnParseError";
  }
}

/** コードフェンスや前後の説明を取り除いてJSON本体を抽出 */
function extractJsonText(raw: string): string {
  let s = raw.trim();
  // ```json ... ``` / ``` ... ``` を除去
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  // 最初の { から最後の } まで
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    s = s.slice(first, last + 1);
  }
  return s;
}

export function parseColumnJson(raw: string): GeneratedColumn {
  const text = extractJsonText(raw);
  let obj: unknown;
  try {
    obj = JSON.parse(text);
  } catch (e) {
    throw new ColumnParseError(`JSONパース失敗: ${(e as Error).message}`);
  }
  const result = GeneratedColumnSchema.safeParse(obj);
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 6)
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(" / ");
    throw new ColumnParseError(`スキーマ不一致: ${issues}`);
  }
  return result.data;
}

/* ------------------------------ 品質検証 ------------------------------ */

export type ValidateOptions = {
  slug: string; // 固定スラッグ（topic.slugHint）
  minLength: number;
  maxLength: number;
  needsSources: boolean;
  existingSlugs: Set<string>;
  existingTitles: Set<string>;
  allowedArticleSlugs: Set<string>;
  allowedJobSlugs: Set<string>; // 募集中エリアのみ
  allowedSourceIds: Set<string>;
};

export type ValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  bodyLength: number;
};

const HARD_MAX_LENGTH = 5500;

/** 断定・誇大・虚偽を示す禁止表現 */
const PROHIBITED_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /必ず稼げ/, label: "「必ず稼げる」" },
  { re: /確実に稼げ/, label: "「確実に稼げる」" },
  { re: /誰でも稼げ/, label: "「誰でも稼げる」" },
  { re: /高収入を保証|収入を保証|報酬を保証/, label: "収入保証の断定" },
  { re: /(年収|月収|日収)[\s]*[0-9０-９〜～]+[\s]*万?円/, label: "根拠のない年収・月収額" },
  { re: /平均(年収|月収|日給|月商|売上)/, label: "根拠のない平均額" },
  { re: /安心してスタート/, label: "禁止表現「安心してスタート」" },
  { re: /一人ひとりに寄り添/, label: "禁止表現「一人ひとりに寄り添」" },
  { re: /あなたの挑戦を応援/, label: "禁止表現「あなたの挑戦を応援」" },
  { re: /新しい一歩を踏み出しましょう/, label: "禁止表現「新しい一歩を踏み出しましょう」" },
  { re: /自分らしく働け/, label: "禁止表現「自分らしく働け」" },
  { re: /充実したサポート体制/, label: "禁止表現「充実したサポート体制」" },
  { re: /未来を一緒につくり/, label: "禁止表現「未来を一緒につくり」" },
  { re: /今すぐ応募しましょう/, label: "煽り表現「今すぐ応募しましょう」" },
];

/** 架空の人物・体験談・口コミを示すヒートマップ的パターン */
const FABRICATION_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /「[^」]{6,}」\s*と(話し|語り|振り返|教えて|おっしゃ)/, label: "架空の発言（インタビュー風）" },
  { re: /さん（\s*[0-9０-９]{2}\s*歳/, label: "架空の人物（氏名＋年齢）" },
  { re: /[0-9０-９]{2}\s*歳）\s*は/, label: "架空の人物（年齢）" },
  { re: /実際に働くドライバーの声|利用者の口コミによると|体験談によると/, label: "架空の口コミ・体験談" },
];

/** 危険・不正な埋め込み */
const UNSAFE_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /<\s*script/i, label: "scriptタグ" },
  { re: /<\s*iframe/i, label: "iframeタグ" },
  { re: /javascript:/i, label: "javascript: URL" },
  { re: /<\/?[a-zA-Z][^>]*>/, label: "HTMLタグ" },
  { re: /\]\(/, label: "Markdownリンク（本文にリンクは書かない）" },
  { re: /https?:\/\/|www\./i, label: "本文中のURL" },
];

export function flattenText(gen: GeneratedColumn): string {
  const parts: string[] = [gen.title, gen.description, gen.introduction];
  for (const s of gen.sections) {
    parts.push(s.heading, s.content);
    for (const sub of s.subsections ?? []) parts.push(sub.heading, sub.content);
  }
  parts.push(...gen.checklist);
  for (const f of gen.faq) parts.push(f.question, f.answer);
  return parts.join("\n");
}

/** 本文の実文字量（title/descriptionを除く。空白は除外して数える） */
export function bodyLength(gen: GeneratedColumn): number {
  const parts: string[] = [gen.introduction];
  for (const s of gen.sections) {
    parts.push(s.content);
    for (const sub of s.subsections ?? []) parts.push(sub.content);
  }
  parts.push(...gen.checklist);
  for (const f of gen.faq) parts.push(f.question, f.answer);
  return parts.join("").replace(/\s/g, "").length;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_DAILY = new Set([20000, 20500, 22000]);
const ALLOWED_LEASE = new Set([30000]);

export function validateGenerated(
  gen: GeneratedColumn,
  opts: ValidateOptions,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const all = flattenText(gen);
  const len = bodyLength(gen);

  // タイトル
  if (!gen.title.trim()) errors.push("titleが空です。");
  const titleLen = [...gen.title].length;
  if (titleLen < 12 || titleLen > 40) {
    warnings.push(`titleの文字数が目安(18〜32)から外れています（${titleLen}）。`);
  }
  if (opts.existingTitles.has(gen.title.trim())) {
    errors.push("titleが既存記事と完全一致しています。");
  }

  // description
  const descLen = [...gen.description].length;
  if (descLen < 100 || descLen > 160) {
    errors.push(`descriptionの文字数が範囲外です（${descLen}／目安100〜160）。`);
  }

  // 本文量
  if (len < opts.minLength) {
    errors.push(`本文が短すぎます（${len}文字／最低${opts.minLength}）。`);
  }
  if (len > HARD_MAX_LENGTH) {
    errors.push(`本文が長すぎます（${len}文字／上限${HARD_MAX_LENGTH}）。`);
  } else if (len > opts.maxLength) {
    warnings.push(`本文が目安上限を超えています（${len}／目安${opts.maxLength}）。`);
  }

  // H2（sections）数
  if (gen.sections.length < 4 || gen.sections.length > 7) {
    errors.push(`H2セクション数が範囲外です（${gen.sections.length}／4〜7）。`);
  }

  // 見出しがタイトルと重複していないか、H1記法が無いか
  for (const s of gen.sections) {
    if (s.heading.trim() === gen.title.trim()) {
      errors.push("H2見出しがタイトルと同一です。");
    }
    if (/^#{1,6}\s/.test(s.heading) || /^#{1,6}\s/.test(s.content)) {
      errors.push("本文にMarkdown見出し記法が含まれています。");
    }
  }

  // slug
  if (!SLUG_RE.test(opts.slug)) {
    errors.push(`slugが不正です（英小文字・数字・ハイフンのみ）：${opts.slug}`);
  }
  if (opts.existingSlugs.has(opts.slug)) {
    errors.push(`slugが既存記事と重複しています：${opts.slug}`);
  }

  // 禁止表現・虚偽・危険埋め込み
  for (const { re, label } of PROHIBITED_PATTERNS) {
    if (re.test(all)) errors.push(`禁止表現を検出：${label}`);
  }
  for (const { re, label } of FABRICATION_PATTERNS) {
    if (re.test(all)) errors.push(`架空の内容の可能性：${label}`);
  }
  for (const { re, label } of UNSAFE_PATTERNS) {
    if (re.test(all)) errors.push(`不正な埋め込み：${label}`);
  }

  // 求人条件との整合（報酬・リース料の数字）
  for (const m of all.matchAll(/(日額|日給)\s*([0-9,]+)\s*円/g)) {
    const n = Number(m[2].replace(/,/g, ""));
    if (!ALLOWED_DAILY.has(n)) {
      errors.push(`求人条件と一致しない日額表記：${m[0]}（許可：20,000／20,500／22,000円）`);
    }
  }
  for (const m of all.matchAll(/月額\s*([0-9,]+)\s*円/g)) {
    const n = Number(m[1].replace(/,/g, ""));
    if (!ALLOWED_LEASE.has(n)) {
      errors.push(`リース料と一致しない月額表記：${m[0]}（許可：30,000円）`);
    }
  }
  // 「給与」表記（業務委託のため報酬を使う。ただし「給与所得」等の制度説明は許容）
  if (/(?<!所得)給与(?!所得)/.test(all) && !/給与所得|給与収入|給与明細/.test(all)) {
    warnings.push("「給与」表記があります。業務委託のため「報酬」が適切か確認してください。");
  }

  // 内部リンク（ホワイトリスト内か）
  for (const s of gen.relatedArticleSlugs) {
    if (!opts.allowedArticleSlugs.has(s)) {
      errors.push(`存在しない関連記事slug：${s}`);
    }
    if (s === opts.slug) {
      warnings.push("関連記事に自分自身のslugが含まれています（除外します）。");
    }
  }
  for (const s of gen.relatedJobSlugs) {
    if (!opts.allowedJobSlugs.has(s)) {
      errors.push(`募集中でない／存在しないエリアslug：${s}`);
    }
  }

  // 出典
  for (const id of gen.sourceIds) {
    if (!opts.allowedSourceIds.has(id)) {
      errors.push(`未登録の出典ID：${id}`);
    }
  }
  if (opts.needsSources && gen.sourceIds.length === 0) {
    errors.push("制度テーマですが出典（sourceIds）が指定されていません。");
  }

  return { ok: errors.length === 0, errors, warnings, bodyLength: len };
}
