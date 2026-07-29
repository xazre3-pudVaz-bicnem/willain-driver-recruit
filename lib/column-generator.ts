/**
 * 採用コラム自動生成のオーケストレーション。
 *
 * 役割：テーマ選定 → プロンプト構築 → Claude生成 → JSON検証 → 重複検証
 *       → 画像割当 → ブロック変換 → 記事ファイル/バレル/履歴/ログの保存。
 *
 * git 操作（commit/push）は行わない（GitHub Actions 側で実施）。
 * dryRun=true のときはファイルを一切書かず、結果だけ返す。
 * assembleArticle は API を使わない純粋処理で、オフライン自己テストからも再利用する。
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import type { ColumnArticle, ColumnBlock } from "@/lib/column";
import { columnArticles } from "@/content/column";
import { jobCommon, getActiveAreas, getJobArea } from "@/lib/jobs";
import { columnTopics, type ColumnTopic } from "@/data/column-topics";
import { getSource, SOURCE_DISCLAIMER } from "@/data/official-sources";
import { pickColumnImage, type ColumnImage } from "@/data/column-images";
import { createMessage, resolveModel, type ChatMessage } from "@/lib/anthropic";
import {
  parseColumnJson,
  validateGenerated,
  flattenText,
  bodyLength,
  ColumnParseError,
  type GeneratedColumn,
} from "@/lib/column-validator";
import {
  COLUMN_SYSTEM_PROMPT,
  buildUserPrompt,
  JSON_FIX_INSTRUCTION,
  type JobFacts,
  type UserPromptContext,
} from "@/prompts/column-system-prompt";

/* ------------------------------ パス ------------------------------ */

const ROOT = process.cwd();
const GENERATED_DIR = path.join(ROOT, "content", "column", "generated");
const GENERATED_BARREL = path.join(GENERATED_DIR, "index.ts");
const HISTORY_PATH = path.join(ROOT, "data", "column-history.json");
const LOG_PATH = path.join(ROOT, "data", "generation-log.json");

/* ------------------------------ 型 ------------------------------ */

export type HistoryEntry = {
  id: string;
  title: string;
  slug: string;
  mainKeyword: string;
  searchIntent: string;
  category: string;
  publishedAt: string;
  summary: string;
  relatedJob: string | null;
  contentHash: string;
  image: string;
};

export type LogEntry = {
  date: string;
  model: string;
  title: string;
  slug: string;
  inputTokens: number;
  outputTokens: number;
  status: "published" | "skipped" | "error";
  errorType: string | null;
};

export type SkipReason =
  | "disabled"
  | "already-posted-today"
  | "max-per-day"
  | "no-topic"
  | "validation"
  | "duplicate";

export type GenerationResult =
  | {
      outcome: "generated";
      dryRun: boolean;
      article: ColumnArticle;
      warnings: string[];
      bodyLength: number;
      usage: { model: string; input: number; output: number };
      filePath: string;
      topicId: string;
    }
  | {
      outcome: "skipped";
      reason: SkipReason;
      detail?: string;
      errors?: string[];
      topicId?: string;
      usage?: { model: string; input: number; output: number };
    };

export type RunOptions = {
  dryRun: boolean;
  today: string; // YYYY-MM-DD（JST）
  enabled: boolean;
  maxPerDay: number;
  minLength: number;
  maxLength: number;
  log?: (msg: string) => void;
};

export type Corpus = {
  existingSlugs: Set<string>;
  existingTitles: string[];
  existingDescriptions: Set<string>;
  activeSlugs: Set<string>;
  history: HistoryEntry[];
};

export type AssembleOptions = {
  today: string;
  minLength: number;
  maxLength: number;
};

export type AssembleResult =
  | {
      ok: true;
      article: ColumnArticle;
      warnings: string[];
      bodyLength: number;
      primaryAreaSlug: string | null;
      image: ColumnImage;
      contentHash: string;
    }
  | { ok: false; reason: "validation" | "duplicate"; errors?: string[]; detail?: string };

/* ------------------------------ ユーティリティ ------------------------------ */

const BRAND_WORDS = ["軽貨物ドライバー", "軽貨物", "ドライバー", "宅配", "配送"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[、。・「」｜|,.!?？！（）()【】[\]〜~ー\-：:／/]/g, "");
}

function ngrams(s: string, n: number): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i + n <= s.length; i++) set.add(s.slice(i, i + n));
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function titleSim(a: string, b: string): number {
  return jaccard(ngrams(normalize(a), 2), ngrams(normalize(b), 2));
}
function textSim(a: string, b: string): number {
  return jaccard(ngrams(normalize(a), 3), ngrams(normalize(b), 3));
}

function distinctiveToken(mainKeyword: string): string {
  const tokens = mainKeyword
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !BRAND_WORDS.includes(t));
  if (tokens.length === 0) return "";
  return tokens.sort((a, b) => b.length - a.length)[0];
}

function articleBodyText(a: ColumnArticle): string {
  const parts: string[] = [];
  for (const b of a.blocks) {
    switch (b.type) {
      case "p":
      case "h2":
      case "h3":
      case "note":
        parts.push(b.text);
        break;
      case "ul":
      case "ol":
        parts.push(b.items.join(""));
        break;
      case "cta":
        if (b.text) parts.push(b.text);
        break;
    }
  }
  return parts.join("");
}

function articleHeadings(a: ColumnArticle): string {
  return a.blocks
    .filter(
      (b): b is Extract<ColumnBlock, { type: "h2" | "h3" }> =>
        b.type === "h2" || b.type === "h3",
    )
    .map((b) => b.text)
    .join(" ");
}

function toParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n+/g, " ").trim())
    .filter((p) => p.length > 0);
}

/* ------------------------------ 求人ファクト ------------------------------ */

export function buildJobFacts(): JobFacts {
  const areas = getActiveAreas().map((a) => ({
    slug: a.slug,
    name: a.areaName,
    shortName: a.shortName,
    dailyPayLabel: a.dailyPayLabel,
  }));
  return {
    companyName: "株式会社ウィラン",
    siteUrl: "https://www.willain.jp/",
    contractType: jobCommon.contractType,
    requirements: [...jobCommon.requirements],
    payLabel: jobCommon.payLabel,
    paySupplement: jobCommon.paySupplement,
    leasePrice: jobCommon.leasePrice,
    workHours: jobCommon.workHours,
    workDays: jobCommon.workDays,
    startLeadTime: jobCommon.startLeadTime,
    support: [...jobCommon.support],
    applyText:
      "応募フォーム（/apply）またはお電話（080-7297-3908）から。面談で条件を最終確認します。",
    areas,
  };
}

export function buildPromptContext(
  topic: ColumnTopic,
  opts: { minLength: number; maxLength: number },
): UserPromptContext {
  return {
    topicTitle: topic.title,
    category: topic.category,
    theme: topic.theme,
    mainKeyword: topic.mainKeyword,
    subKeywords: topic.subKeywords,
    searchIntent: topic.searchIntent,
    needsSources: topic.needsSources,
    jobFacts: buildJobFacts(),
    articleOptions: columnArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
    })),
    jobAreaOptions: getActiveAreas().map((a) => ({
      slug: a.slug,
      label: `${a.areaName}（${a.dailyPayLabel}）`,
    })),
    sourceOptions: topic.sourceIds
      .map((id) => getSource(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({ id: s.id, name: s.name, scope: s.scope })),
    minLength: opts.minLength,
    maxLength: opts.maxLength,
  };
}

/* ------------------------------ 履歴・ログ I/O ------------------------------ */

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  return readJson<HistoryEntry[]>(HISTORY_PATH, []);
}

export function buildCorpus(history: HistoryEntry[]): Corpus {
  return {
    existingSlugs: new Set(columnArticles.map((a) => a.slug)),
    existingTitles: columnArticles.map((a) => a.title),
    existingDescriptions: new Set(columnArticles.map((a) => a.description)),
    activeSlugs: new Set(getActiveAreas().map((a) => a.slug)),
    history,
  };
}

/* ------------------------------ テーマ選定 ------------------------------ */

export function selectTopic(corpus: Corpus): ColumnTopic | null {
  const usedTopicIds = new Set(corpus.history.map((h) => h.id));

  for (const topic of columnTopics) {
    if (usedTopicIds.has(topic.id)) continue; // 過去に生成済み
    if (corpus.existingSlugs.has(topic.slugHint)) continue; // slug衝突

    // 制度テーマは出典が全て登録済みでなければ生成しない
    if (topic.needsSources) {
      const ok =
        topic.sourceIds.length > 0 &&
        topic.sourceIds.every((id) => Boolean(getSource(id)));
      if (!ok) continue;
    }

    // 既存記事に既にカバーされているテーマはスキップ（無駄な生成を避ける）
    const token = distinctiveToken(topic.mainKeyword);
    const coveredByToken =
      token.length >= 2 && corpus.existingTitles.some((t) => t.includes(token));
    const coveredByTitle = corpus.existingTitles.some(
      (t) => titleSim(topic.title, t) >= 0.55,
    );
    if (coveredByToken || coveredByTitle) continue;

    return topic;
  }
  return null;
}

/* ------------------------------ 組み立て（API不使用） ------------------------------ */

export function assembleArticle(
  gen: GeneratedColumn,
  topic: ColumnTopic,
  corpus: Corpus,
  opts: AssembleOptions,
): AssembleResult {
  // 4) 品質・安全・整合の検証
  const validation = validateGenerated(gen, {
    slug: topic.slugHint,
    minLength: opts.minLength,
    maxLength: opts.maxLength,
    needsSources: topic.needsSources,
    existingSlugs: corpus.existingSlugs,
    existingTitles: new Set(corpus.existingTitles),
    allowedArticleSlugs: corpus.existingSlugs,
    allowedJobSlugs: corpus.activeSlugs,
    allowedSourceIds: new Set(topic.sourceIds),
  });
  if (corpus.existingDescriptions.has(gen.description.trim())) {
    validation.errors.push("descriptionが既存記事と完全一致しています。");
    validation.ok = false;
  }
  if (!validation.ok) {
    return { ok: false, reason: "validation", errors: validation.errors };
  }

  // 5) 重複（カニバリ）検証：既存コーパスと比較
  const genHeadings = gen.sections
    .flatMap((s) => [s.heading, ...(s.subsections ?? []).map((x) => x.heading)])
    .join(" ");
  const genBody = flattenText(gen);
  for (const ex of columnArticles) {
    const tSim = titleSim(gen.title, ex.title);
    const hSim = textSim(genHeadings, articleHeadings(ex));
    const bSim = textSim(genBody, articleBodyText(ex));
    if (tSim >= 0.8 || hSim >= 0.7 || bSim >= 0.65) {
      return {
        ok: false,
        reason: "duplicate",
        detail: `既存記事「${ex.title}」と重複（title:${tSim.toFixed(2)} / heading:${hSim.toFixed(2)} / body:${bSim.toFixed(2)}）`,
      };
    }
  }

  // 6) 画像割当（直近5記事で使った画像を避ける）
  const recentImages = corpus.history
    .map((h) => h.image)
    .filter((p): p is string => Boolean(p));
  const image = pickColumnImage(recentImages, topic.imageCategory);

  // 7) 内部リンクの確定（存在・募集中を保証）
  const primaryAreaSlug =
    (topic.area && corpus.activeSlugs.has(topic.area) && topic.area) ||
    gen.relatedJobSlugs.find((s) => corpus.activeSlugs.has(s)) ||
    getActiveAreas()[0]?.slug ||
    null;
  const relatedJobs = Array.from(
    new Set(
      [primaryAreaSlug, ...gen.relatedJobSlugs].filter(
        (s): s is string => s !== null && corpus.activeSlugs.has(s),
      ),
    ),
  );

  const related = resolveRelatedArticles(gen, topic, corpus.existingSlugs);
  const blocks = buildBlocks(gen, topic, primaryAreaSlug, related);

  const article: ColumnArticle = {
    slug: topic.slugHint,
    title: gen.title.trim(),
    description: gen.description.trim(),
    category: topic.category,
    publishedAt: opts.today,
    updatedAt: opts.today,
    related,
    image: image.path,
    imageAlt: image.alt,
    tags: (gen.tags ?? []).slice(0, 5),
    author: "株式会社ウィラン 採用担当",
    status: "published",
    generatedBy: resolveModel(),
    mainKeyword: topic.mainKeyword,
    subKeywords: topic.subKeywords,
    searchIntent: topic.searchIntent,
    relatedJobs,
    sourceIds: gen.sourceIds,
    blocks,
  };

  const contentHash = crypto
    .createHash("sha256")
    .update(normalize(genBody))
    .digest("hex")
    .slice(0, 16);

  return {
    ok: true,
    article,
    warnings: validation.warnings,
    bodyLength: bodyLength(gen),
    primaryAreaSlug,
    image,
    contentHash,
  };
}

/* ------------------------------ 生成本体 ------------------------------ */

export async function runGeneration(
  opts: RunOptions,
): Promise<GenerationResult> {
  const log = opts.log ?? (() => {});

  if (!opts.enabled) {
    return {
      outcome: "skipped",
      reason: "disabled",
      detail: "AUTO_COLUMN_ENABLED=false",
    };
  }

  const history = await loadHistory();
  const genLog = await readJson<LogEntry[]>(LOG_PATH, []);

  // 同日の二重投稿ガード
  const publishedToday = genLog.filter(
    (l) => l.date === opts.today && l.status === "published",
  ).length;
  if (!opts.dryRun && publishedToday >= 1) {
    return { outcome: "skipped", reason: "already-posted-today", detail: opts.today };
  }
  if (!opts.dryRun && publishedToday >= opts.maxPerDay) {
    return { outcome: "skipped", reason: "max-per-day", detail: `${publishedToday}/${opts.maxPerDay}` };
  }

  const corpus = buildCorpus(history);

  // 1) テーマ選定（ローカル処理・APIは呼ばない）
  const topic = selectTopic(corpus);
  if (!topic) {
    return { outcome: "skipped", reason: "no-topic", detail: "未使用テーマがありません" };
  }
  log(`テーマ選定: [${topic.id}] ${topic.title}`);

  // 2) プロンプト構築 → 3) 生成（最大2回：初回 + JSON修正1回）
  const messages: ChatMessage[] = [
    { role: "user", content: buildUserPrompt(buildPromptContext(topic, opts)) },
  ];
  let usageInput = 0;
  let usageOutput = 0;
  const model = resolveModel();

  let gen: GeneratedColumn | null = null;
  for (let attempt = 0; attempt < 2 && !gen; attempt++) {
    log(attempt === 0 ? "記事を生成中…" : "JSONを修正依頼中…");
    const res = await createMessage({
      system: COLUMN_SYSTEM_PROMPT,
      messages,
      maxTokens: 8000,
      temperature: 0.6,
    });
    usageInput += res.usage.input_tokens;
    usageOutput += res.usage.output_tokens;

    try {
      gen = parseColumnJson(res.text);
    } catch (e) {
      if (!(e instanceof ColumnParseError)) throw e;
      if (attempt === 0) {
        messages.push({ role: "assistant", content: res.text });
        messages.push({ role: "user", content: JSON_FIX_INSTRUCTION });
      } else {
        throw e; // 2回失敗 → 呼び出し側でエラー終了
      }
    }
  }
  if (!gen) throw new ColumnParseError("JSON生成に2回失敗しました。");

  const usage = { model, input: usageInput, output: usageOutput };
  log(`生成完了（in:${usageInput} / out:${usageOutput} tokens）`);

  // 4〜9) 検証・重複・画像・リンク・ブロック（API不使用）
  const assembled = assembleArticle(gen, topic, corpus, opts);
  if (!assembled.ok) {
    return {
      outcome: "skipped",
      reason: assembled.reason,
      errors: assembled.errors,
      detail: assembled.detail,
      topicId: topic.id,
      usage,
    };
  }

  const { article, image, primaryAreaSlug, contentHash } = assembled;
  const filePath = path.join(GENERATED_DIR, `${topic.slugHint}.ts`);

  if (opts.dryRun) {
    return {
      outcome: "generated",
      dryRun: true,
      article,
      warnings: assembled.warnings,
      bodyLength: assembled.bodyLength,
      usage,
      filePath,
      topicId: topic.id,
    };
  }

  // 10) 保存
  await writeArticleFiles(article);

  history.push({
    id: topic.id,
    title: article.title,
    slug: article.slug,
    mainKeyword: topic.mainKeyword,
    searchIntent: topic.searchIntent,
    category: topic.category,
    publishedAt: opts.today,
    summary: article.description,
    relatedJob: primaryAreaSlug,
    contentHash,
    image: image.path,
  });
  await writeJson(HISTORY_PATH, history);

  genLog.push({
    date: opts.today,
    model,
    title: article.title,
    slug: article.slug,
    inputTokens: usageInput,
    outputTokens: usageOutput,
    status: "published",
    errorType: null,
  });
  await writeJson(LOG_PATH, genLog);

  return {
    outcome: "generated",
    dryRun: false,
    article,
    warnings: assembled.warnings,
    bodyLength: assembled.bodyLength,
    usage,
    filePath,
    topicId: topic.id,
  };
}

/* ------------------------------ 関連記事の確定 ------------------------------ */

function resolveRelatedArticles(
  gen: GeneratedColumn,
  topic: ColumnTopic,
  existingSlugs: Set<string>,
): string[] {
  const picked = gen.relatedArticleSlugs.filter(
    (s) => existingSlugs.has(s) && s !== topic.slugHint,
  );
  const set = new Set(picked);
  if (set.size < 2) {
    for (const a of columnArticles) {
      if (set.size >= 3) break;
      if (a.category === topic.category && a.slug !== topic.slugHint) set.add(a.slug);
    }
  }
  if (set.size < 2) {
    for (const a of columnArticles) {
      if (set.size >= 3) break;
      if (a.slug !== topic.slugHint) set.add(a.slug);
    }
  }
  return Array.from(set).slice(0, 3);
}

/* ------------------------------ ブロック変換 ------------------------------ */

function pillarLink(topic: ColumnTopic): { href: string; label: string } {
  if (topic.theme === "未経験者向け" || topic.theme === "研修・仕事の覚え方") {
    return { href: "/beginner", label: "未経験からの始め方・研修内容を見る" };
  }
  if (topic.category === "お金・報酬") {
    return { href: "/benefits", label: "軽貨物ドライバーとして働くメリットを見る" };
  }
  return { href: "/work", label: "軽貨物ドライバーの仕事内容を見る" };
}

function buildBlocks(
  gen: GeneratedColumn,
  topic: ColumnTopic,
  primaryAreaSlug: string | null,
  related: string[],
): ColumnBlock[] {
  const blocks: ColumnBlock[] = [];

  for (const p of toParagraphs(gen.introduction)) blocks.push({ type: "p", text: p });

  for (const s of gen.sections) {
    blocks.push({ type: "h2", text: s.heading.trim() });
    for (const p of toParagraphs(s.content)) blocks.push({ type: "p", text: p });
    for (const sub of s.subsections ?? []) {
      blocks.push({ type: "h3", text: sub.heading.trim() });
      for (const p of toParagraphs(sub.content)) blocks.push({ type: "p", text: p });
    }
  }

  const checklist = gen.checklist.map((c) => c.trim()).filter(Boolean);
  if (checklist.length > 0) {
    blocks.push({ type: "h2", text: "応募前に確認しておきたいこと" });
    blocks.push({ type: "ul", items: checklist });
  }

  const faq = gen.faq.filter((f) => f.question.trim() && f.answer.trim());
  if (faq.length > 0) {
    blocks.push({ type: "h2", text: "よくある質問" });
    for (const f of faq) {
      blocks.push({ type: "h3", text: f.question.trim() });
      blocks.push({ type: "p", text: f.answer.trim() });
    }
  }

  blocks.push({ type: "h2", text: "株式会社ウィランの軽貨物ドライバー求人" });
  blocks.push({
    type: "cta",
    href: "/jobs",
    label: "東京・千葉の軽貨物ドライバー求人一覧を見る",
    text: "品川・江東・葛西・船橋で軽貨物ドライバー（業務委託）を募集しています。報酬・勤務条件はエリアにより異なります。",
  });
  if (primaryAreaSlug) {
    const area = getJobArea(primaryAreaSlug);
    if (area) {
      blocks.push({
        type: "cta",
        href: `/jobs/${area.slug}`,
        label: `${area.shortName}の軽貨物ドライバー求人（${area.dailyPayLabel}）を確認する`,
      });
    }
  }
  const pillar = pillarLink(topic);
  blocks.push({ type: "cta", href: pillar.href, label: pillar.label });

  if (gen.sourceIds.length > 0) {
    const sources = gen.sourceIds
      .map((id) => getSource(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    if (sources.length > 0) {
      blocks.push({ type: "h2", text: "参考にした公式情報" });
      blocks.push({
        type: "sources",
        items: sources.map((s) => ({
          name: s.name,
          url: s.url,
          checkedDate: s.checkedDate,
        })),
      });
      blocks.push({ type: "note", text: SOURCE_DISCLAIMER });
    }
  }

  void related; // related はテンプレート下部の「関連記事」で表示（重複表示しない）
  return blocks;
}

/* ------------------------------ ファイル生成 ------------------------------ */

export function renderArticleFile(article: ColumnArticle): string {
  return (
    `import type { ColumnArticle } from "@/lib/column";\n\n` +
    `// このファイルは generate-column により自動生成されています。手動編集しないでください。\n` +
    `export const article: ColumnArticle = ${JSON.stringify(article, null, 2)};\n`
  );
}

/** 記事ファイルを書き出し、バレル（index.ts）を再生成する */
export async function writeArticleFiles(article: ColumnArticle): Promise<string> {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  const filePath = path.join(GENERATED_DIR, `${article.slug}.ts`);
  await fs.writeFile(filePath, renderArticleFile(article), "utf8");
  await rewriteBarrel();
  return filePath;
}

async function rewriteBarrel(): Promise<void> {
  const files = (await fs.readdir(GENERATED_DIR))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => f.replace(/\.ts$/, ""))
    .sort();

  const importLines = files
    .map((slug) => `import { article as ${toIdent(slug)} } from "./${slug}";`)
    .join("\n");
  const arrayLines = files.map((slug) => `  ${toIdent(slug)},`).join("\n");

  const content =
    `import type { ColumnArticle } from "@/lib/column";\n\n` +
    `// 自動生成コラムのバレル。generate-column が管理します（手動編集しない）。\n` +
    (importLines ? importLines + "\n\n" : "\n") +
    `export const generatedColumnArticles: ColumnArticle[] = [\n${arrayLines}\n];\n`;

  await fs.writeFile(GENERATED_BARREL, content, "utf8");
}

function toIdent(slug: string): string {
  const camel = slug.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
  return `article_${camel}`;
}

/* ------------------------------ エラー→ログ ------------------------------ */

export async function appendErrorLog(
  today: string,
  errorType: string,
  title = "-",
  slug = "-",
): Promise<void> {
  const genLog = await readJson<LogEntry[]>(LOG_PATH, []);
  genLog.push({
    date: today,
    model: resolveModel(),
    title,
    slug,
    inputTokens: 0,
    outputTokens: 0,
    status: "error",
    errorType,
  });
  await writeJson(LOG_PATH, genLog);
}
