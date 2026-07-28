/**
 * SEO自動検証スクリプト（ビルド後の静的HTMLを検査）。
 *
 *   npm run seo:audit     # 全項目をレポート表示（情報のみ）
 *   npm run seo:validate  # 全項目を検証し、NGがあれば exit 1
 *   npm run seo:links     # 内部リンク切れ・空href のみ
 *   npm run seo:schema    # 構造化データ（JobPosting/ItemList等）のみ
 *
 * 事前に `npm run build` が必要（.next/server/app/*.html を読む）。
 */
import fs from "node:fs";
import path from "node:path";

const MODE = process.argv[2] || "audit";
const APP_DIR = ".next/server/app";

if (!fs.existsSync(APP_DIR)) {
  console.error(`✗ ${APP_DIR} が見つかりません。先に \`npm run build\` を実行してください。`);
  process.exit(1);
}

/* ---------- HTMLファイルの収集 ---------- */
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** HTMLファイルパス → ルート（/jobs/shinagawa 等）。Windowsの区切りも正規化。 */
function routeOf(file) {
  let r = file
    .replace(/\\/g, "/")
    .replace(".next/server/app", "")
    .replace(/\.html$/, "");
  if (r === "/index" || r === "") r = "/";
  return r;
}

const htmlFiles = walk(APP_DIR).filter((f) => {
  const r = routeOf(f);
  // 生成メタ系・Next内部ページ（_not-found, _global-error 等）は検証対象外
  if (r.startsWith("/_")) return false;
  return !["/icon", "/apple-icon", "/opengraph-image", "/manifest"].includes(r);
});

const pages = htmlFiles.map((f) => ({
  file: f,
  route: routeOf(f),
  html: fs.readFileSync(f, "utf8"),
}));

/* ---------- 有効ルート一覧（内部リンク照合用） ---------- */
const validRoutes = new Set(pages.map((p) => p.route));
// noindexページ・生成エンドポイント（メタ用リンク先）も有効URLとして扱う
for (const r of [
  "/apply/thanks",
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/manifest.webmanifest",
  "/sitemap.xml",
  "/robots.txt",
]) {
  validRoutes.add(r);
}

/* ---------- ヘルパ ---------- */
const grab = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : "";
};
const title = (h) => grab(h, /<title>([^<]*)<\/title>/);
const desc = (h) => grab(h, /<meta name="description" content="([^"]*)"/);
const canonical = (h) => grab(h, /rel="canonical" href="([^"]*)"/);
const h1count = (h) => (h.match(/<h1/g) || []).length;
const isNoindex = (h) => /name="robots" content="noindex/.test(h);
const jsonldTypes = (h) =>
  [...h.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
const internalLinks = (h) =>
  [...h.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);

const results = [];
const add = (level, msg) => results.push({ level, msg });

/* ---------- 各ページ検証 ---------- */
const titles = new Map();
const descs = new Map();
const indexPages = pages.filter((p) => !isNoindex(p.html));

for (const p of indexPages) {
  const t = title(p.html);
  const d = desc(p.html);
  if (!t) add("error", `${p.route}: title が空`);
  if (!d) add("error", `${p.route}: description が空`);
  if (!canonical(p.html)) add("error", `${p.route}: canonical なし`);
  const h1 = h1count(p.html);
  if (h1 !== 1) add("error", `${p.route}: H1 が ${h1} 個（1個であるべき）`);
  if (t) titles.set(t, [...(titles.get(t) || []), p.route]);
  if (d) descs.set(d, [...(descs.get(d) || []), p.route]);

  // 画像alt
  const imgs = [...p.html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const img of imgs) {
    if (!/\balt=/.test(img)) add("error", `${p.route}: alt無しの<img>があります`);
  }
  // localhost / vercelドメインの残留（内部リンク・URL）
  if (/http:\/\/localhost/.test(p.html))
    add("error", `${p.route}: localhost URLが残っています`);
  if (/\.vercel\.app/.test(p.html))
    add("warn", `${p.route}: vercel.app ドメインが含まれます`);
  // ダミーテキスト
  if (/\b(TODO|FIXME|lorem ipsum|ダミーテキスト)\b/i.test(p.html))
    add("error", `${p.route}: TODO/ダミーテキストが含まれます`);
}

// title / description 重複
for (const [t, routes] of titles)
  if (routes.length > 1) add("error", `title重複: "${t}" → ${routes.join(", ")}`);
for (const [d, routes] of descs)
  if (routes.length > 1)
    add("error", `description重複: ${routes.join(", ")}`);

/* ---------- 内部リンク切れ・空href ---------- */
for (const p of pages) {
  if (/href="\s*"/.test(p.html)) add("error", `${p.route}: 空のhrefがあります`);
  for (const link of internalLinks(p.html)) {
    // 動的・静的アセットは除外
    if (link.startsWith("/_next") || link.startsWith("/images") || link.includes("."))
      continue;
    if (!validRoutes.has(link))
      add("error", `${p.route}: リンク切れ → ${link}`);
  }
}

/* ---------- 構造化データ ---------- */
const jobsList = pages.find((p) => p.route === "/jobs");
if (jobsList) {
  if (jsonldTypes(jobsList.html).includes("JobPosting"))
    add("error", "/jobs: 求人一覧にJobPostingが付いています（不可）");
  if (!jsonldTypes(jobsList.html).includes("ItemList"))
    add("warn", "/jobs: ItemListがありません");
}

const jobDetails = pages.filter((p) => /^\/jobs\/[^/]+$/.test(p.route));
const seenIdentifiers = new Map();
for (const p of jobDetails) {
  const types = jsonldTypes(p.html);
  const jpCount = (p.html.match(/"@type":"JobPosting"/g) || []).length;
  if (jpCount === 0) add("error", `${p.route}: JobPostingがありません`);
  if (jpCount > 1) add("error", `${p.route}: JobPostingが${jpCount}個（重複）`);
  if (!types.includes("BreadcrumbList"))
    add("warn", `${p.route}: BreadcrumbListがありません`);

  // identifier の重複
  const id = grab(p.html, /"identifier":\{[^}]*"value":"([^"]+)"/);
  if (id) {
    if (seenIdentifiers.has(id))
      add("error", `${p.route}: identifier重複 "${id}"（${seenIdentifiers.get(id)}と同一）`);
    else seenIdentifiers.set(id, p.route);
  }

  // baseSalary と画面表示日額の一致
  const salary = grab(p.html, /"value":(\d+),"unitText":"DAY"/);
  if (salary) {
    const withComma = Number(salary).toLocaleString("en-US");
    if (!p.html.includes(`日額${withComma}円`))
      add("error", `${p.route}: JobPostingの報酬(${withComma})が画面表示と不一致の可能性`);
  } else {
    add("error", `${p.route}: baseSalary(DAY)が見つかりません`);
  }

  // datePosted が未来日でないか
  const dp = grab(p.html, /"datePosted":"([^"]+)"/);
  if (dp && new Date(dp) > new Date("2100-01-01"))
    add("error", `${p.route}: datePostedが不正 ${dp}`);
}

/* ---------- 出力 ---------- */
let filtered = results;
if (MODE === "links")
  filtered = results.filter((r) => /リンク|href/.test(r.msg));
if (MODE === "schema")
  filtered = results.filter((r) =>
    /(JobPosting|ItemList|Breadcrumb|identifier|報酬|baseSalary|datePosted)/.test(r.msg)
  );

const errors = filtered.filter((r) => r.level === "error");
const warns = filtered.filter((r) => r.level === "warn");

console.log(`\n=== SEO検証 (${MODE}) : ${pages.length}ページ ===`);
if (filtered.length === 0) {
  console.log("✓ 問題は見つかりませんでした。");
} else {
  for (const r of errors) console.log(`  ✗ ${r.msg}`);
  for (const r of warns) console.log(`  ⚠ ${r.msg}`);
}
console.log(`\nerror: ${errors.length}  /  warn: ${warns.length}`);

if (MODE === "audit") {
  console.log("\n--- ページ別 title / description ---");
  for (const p of indexPages.sort((a, b) => a.route.localeCompare(b.route))) {
    console.log(`  [${p.route}] ${title(p.html)}`);
  }
}

if (MODE === "validate" && errors.length > 0) process.exit(1);
process.exit(0);
