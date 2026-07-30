/**
 * ソースレベルのSEO/品質検証（ビルド不要・tsxで実行）。
 *
 *   npm run seo:content     … コラム本文の品質・禁止表現・AI表記整合・出典・分量
 *   npm run seo:duplicates  … コラム間の重複（タイトル/見出し/本文の類似度）
 *   npm run seo:jobs        … 求人データとJobPostingの整合（報酬・identifier・日付）
 *
 * いずれもNGがあれば exit 1。
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { publishedColumnArticles, columnArticles } from "@/content/column";
import type { ColumnArticle } from "@/lib/column";
import { jobAreas, getActiveAreas } from "@/lib/jobs";

const MODE = process.argv[2] || "content";
const errors: string[] = [];
const warns: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warns.push(m);

/* ------------------------------ 共通 ------------------------------ */

function blockText(a: ColumnArticle): string {
  const out: string[] = [a.title, a.description];
  for (const b of a.blocks) {
    if (b.type === "p" || b.type === "h2" || b.type === "h3" || b.type === "note") out.push(b.text);
    else if (b.type === "ul" || b.type === "ol") out.push(b.items.join(""));
    else if (b.type === "cta" && b.text) out.push(b.text);
  }
  return out.join("\n");
}
function headings(a: ColumnArticle): string {
  return a.blocks.filter((b) => b.type === "h2" || b.type === "h3").map((b) => (b as { text: string }).text).join(" ");
}
function bodyLen(a: ColumnArticle): number {
  return a.blocks
    .map((b) =>
      b.type === "p" || b.type === "note"
        ? b.text
        : b.type === "ul" || b.type === "ol"
          ? b.items.join("")
          : "",
    )
    .join("")
    .replace(/\s/g, "").length;
}
const norm = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "").replace(/[、。・「」｜|,.!?？！（）()【】[\]〜~ー\-：:／/]/g, "");
function ngrams(s: string, n: number) {
  const set = new Set<string>();
  for (let i = 0; i + n <= s.length; i++) set.add(s.slice(i, i + n));
  return set;
}
function jaccard(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
const titleSim = (a: string, b: string) => jaccard(ngrams(norm(a), 2), ngrams(norm(b), 2));
const textSim = (a: string, b: string) => jaccard(ngrams(norm(a), 3), ngrams(norm(b), 3));

/* ------------------------------ content ------------------------------ */

const PROHIBITED = [
  /必ず稼げ/, /確実に稼げ/, /誰でも稼げ/, /高収入を保証|収入を保証|報酬を保証/,
  /(年収|月収|日収)[\s]*[0-9０-９〜～]+[\s]*万?円/, /平均(年収|月収|日給)/,
  /安心してスタート/, /一人ひとりに寄り添/, /あなたの挑戦を応援/, /今すぐ応募しましょう/,
];
const ALLOWED_DAILY = new Set([20000, 20500, 22000]);

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function checkContent() {
  for (const a of columnArticles) {
    const text = blockText(a);
    // 禁止表現
    for (const re of PROHIBITED) if (re.test(text)) err(`${a.slug}: 禁止/誇大表現の可能性 → ${re}`);
    // HTML/script/URL混入
    if (/<\/?[a-zA-Z][^>]*>/.test(text)) err(`${a.slug}: HTMLタグが本文に含まれます`);
    if (/https?:\/\//.test(text)) warn(`${a.slug}: 本文にURLが含まれます（内部リンクはcta推奨）`);
    // 報酬額の整合
    for (const m of text.matchAll(/(日額|日給)\s*([0-9,]+)\s*円/g)) {
      const n = Number(m[2].replace(/,/g, ""));
      if (!ALLOWED_DAILY.has(n)) err(`${a.slug}: 求人条件と不一致の日額 → ${m[0]}`);
    }
    // 分量（公開記事のみ）
    if ((a.status ?? "published") === "published" && bodyLen(a) < 2000)
      warn(`${a.slug}: 本文が短め（${bodyLen(a)}字）`);
    // AI表記の整合
    if (a.generatedWithAI === true && a.humanReviewed !== true) {
      if ((a.author ?? "").includes("採用担当"))
        err(`${a.slug}: AI補助・未確認なのに著者が「採用担当」（実態と不一致）`);
    }
    if (a.humanReviewed === true && (!a.reviewedBy || !a.reviewedAt))
      err(`${a.slug}: humanReviewed=true だが reviewedBy/reviewedAt が未設定`);
    // 画像の存在
    if (a.image) {
      const abs = path.join(process.cwd(), "public", a.image.replace(/^\//, ""));
      if (!(await fileExists(abs))) err(`${a.slug}: 画像が存在しない → ${a.image}`);
    }
    // 関連記事の存在
    for (const rel of a.related)
      if (!columnArticles.some((x) => x.slug === rel)) err(`${a.slug}: 関連記事slugが存在しない → ${rel}`);
  }
  console.log(`content: ${columnArticles.length}記事を検査`);
}

/* ------------------------------ duplicates ------------------------------ */

function checkDuplicates() {
  const arts = publishedColumnArticles;
  for (let i = 0; i < arts.length; i++) {
    for (let j = i + 1; j < arts.length; j++) {
      const a = arts[i], b = arts[j];
      const t = titleSim(a.title, b.title);
      const h = textSim(headings(a), headings(b));
      const bd = textSim(blockText(a), blockText(b));
      if (t >= 0.8) err(`タイトル類似(${t.toFixed(2)}): ${a.slug} ↔ ${b.slug}`);
      else if (t >= 0.65) warn(`タイトルやや類似(${t.toFixed(2)}): ${a.slug} ↔ ${b.slug}`);
      if (h >= 0.7) err(`見出し類似(${h.toFixed(2)}): ${a.slug} ↔ ${b.slug}`);
      if (bd >= 0.65) err(`本文類似(${bd.toFixed(2)}): ${a.slug} ↔ ${b.slug}`);
    }
  }
  // mainKeyword の重複（設定済みのもの同士）
  const kw = new Map<string, string[]>();
  for (const a of arts) if (a.mainKeyword) kw.set(a.mainKeyword, [...(kw.get(a.mainKeyword) || []), a.slug]);
  for (const [k, slugs] of kw) if (slugs.length > 1) err(`mainKeyword重複 "${k}": ${slugs.join(", ")}`);
  console.log(`duplicates: ${arts.length}記事の総当たり比較`);
}

/* ------------------------------ jobs ------------------------------ */

function todayJst(): string {
  const jst = new Date(Date.now() + 9 * 3600 * 1000);
  return jst.toISOString().slice(0, 10);
}

function checkJobs() {
  const today = todayJst();
  const ids = new Map<string, string>();
  for (const area of jobAreas) {
    // identifier 一意
    if (ids.has(area.identifier)) err(`identifier重複: ${area.slug} と ${ids.get(area.identifier)}`);
    else ids.set(area.identifier, area.slug);
    // datePosted 未来日でない
    if (area.datePosted > today) err(`${area.slug}: datePostedが未来日 ${area.datePosted}`);
    // validThrough があれば未来日
    if (area.validThrough && area.validThrough < today)
      err(`${area.slug}: validThroughが過去日 ${area.validThrough}（募集終了ならisActive=falseに）`);
    // dailyPay と label の整合
    const labelNum = Number((area.dailyPayLabel.match(/([0-9,]+)/)?.[1] || "").replace(/,/g, ""));
    if (labelNum !== area.dailyPay)
      err(`${area.slug}: dailyPay(${area.dailyPay})とdailyPayLabel(${area.dailyPayLabel})が不一致`);
    if (!ALLOWED_DAILY.has(area.dailyPay))
      warn(`${area.slug}: dailyPayが想定外 ${area.dailyPay}`);
  }
  const active = getActiveAreas();
  if (active.length === 0) err("募集中(isActive)エリアが0件です");
  console.log(`jobs: 全${jobAreas.length}エリア（募集中${active.length}）を検査`);
}

/* ------------------------------ 実行 ------------------------------ */

async function main() {
  if (MODE === "content") await checkContent();
  else if (MODE === "duplicates") checkDuplicates();
  else if (MODE === "jobs") checkJobs();
  else {
    console.error(`不明なモード: ${MODE}（content|duplicates|jobs）`);
    process.exit(2);
  }

  console.log(`\n=== seo:${MODE} ===`);
  if (errors.length === 0 && warns.length === 0) console.log("✓ 問題は見つかりませんでした。");
  for (const e of errors) console.log(`  ✗ ${e}`);
  for (const w of warns) console.log(`  ⚠ ${w}`);
  console.log(`\nerror: ${errors.length}  /  warn: ${warns.length}`);
  process.exit(errors.length > 0 ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
