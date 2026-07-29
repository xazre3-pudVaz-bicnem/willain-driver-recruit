/**
 * 採用コラム自動生成のCLIエントリ。
 *
 *   npm run column:generate       … 生成して記事ファイルを保存（commit/pushはワークフロー側）
 *   npm run column:generate:dry   … テーマ選定〜生成〜検証〜重複〜SEOまで。保存/commit/pushはしない
 *   npm run column:validate       … APIを使わず、コーパス健全性＋組み立てパイプラインを自己テスト
 *
 * 失敗時（APIエラー・JSON2回失敗・書き込み失敗など）は exit 1。
 * スキップ（未使用テーマなし・重複・同日投稿済みなど）は正常終了 exit 0。
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { publishedColumnArticles, columnArticles } from "@/content/column";
import { getActiveAreas } from "@/lib/jobs";
import { registeredSourceIds } from "@/data/official-sources";
import { columnImages } from "@/data/column-images";
import type { GeneratedColumn } from "@/lib/column-validator";
import {
  runGeneration,
  appendErrorLog,
  loadHistory,
  buildCorpus,
  selectTopic,
  assembleArticle,
  renderArticleFile,
  type GenerationResult,
} from "@/lib/column-generator";
import { AnthropicError } from "@/lib/anthropic";

/* ------------------------------ 設定・引数 ------------------------------ */

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run") || argv.includes("--dry");
const VALIDATE_ONLY = argv.includes("--validate-only") || argv.includes("--validate");

function envFlag(name: string, def: boolean): boolean {
  const v = process.env[name];
  if (v == null) return def;
  return v.trim().toLowerCase() !== "false" && v.trim() !== "0";
}
function envInt(name: string, def: number): number {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : def;
}

const ENABLED = envFlag("AUTO_COLUMN_ENABLED", true);
const MAX_PER_DAY = envInt("AUTO_COLUMN_MAX_PER_DAY", 1);
const MIN_LENGTH = envInt("AUTO_COLUMN_MIN_LENGTH", 2500);
const MAX_LENGTH = envInt("AUTO_COLUMN_MAX_LENGTH", 4500);

function todayJst(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

const line = (s = "") => console.log(s);

/* ------------------------------ 使用量ログ ------------------------------ */

function printUsage(usage?: { model: string; input: number; output: number }, title?: string) {
  if (!usage) return;
  line("── API使用量 ─────────────");
  line(`  model:         ${usage.model}`);
  line(`  input_tokens:  ${usage.input}`);
  line(`  output_tokens: ${usage.output}`);
  if (title) line(`  title:         ${title}`);
  line("──────────────────────────");
}

/* ------------------------------ 結果表示 ------------------------------ */

function reportResult(result: GenerationResult): number {
  if (result.outcome === "skipped") {
    line(`⏭  スキップ: ${result.reason}${result.detail ? ` — ${result.detail}` : ""}`);
    if (result.errors?.length) {
      line("  検証エラー:");
      for (const e of result.errors) line(`   - ${e}`);
    }
    printUsage(result.usage);
    return 0; // スキップは失敗ではない
  }

  // generated
  const a = result.article;
  line(`✅ ${result.dryRun ? "生成（dry-run・未保存）" : "記事を保存しました"}`);
  line(`  slug:      ${a.slug}`);
  line(`  title:     ${a.title}`);
  line(`  category:  ${a.category}`);
  line(`  本文文字数: ${result.bodyLength}`);
  line(`  画像:      ${a.image}（alt: ${a.imageAlt}）`);
  line(`  関連記事:  ${a.related?.join(", ")}`);
  line(`  関連求人:  ${a.relatedJobs?.join(", ") || "-"}`);
  line(`  出典:      ${a.sourceIds?.join(", ") || "なし"}`);
  if (result.warnings.length) {
    line("  警告:");
    for (const w of result.warnings) line(`   - ${w}`);
  }
  if (!result.dryRun) line(`  ファイル:  ${result.filePath}`);
  printUsage(result.usage, a.title);
  return 0;
}

/* ------------------------------ generate / dry-run ------------------------------ */

async function runGenerateMode(): Promise<number> {
  const today = todayJst();
  line(`▶ コラム自動生成${DRY_RUN ? "（dry-run）" : ""}  対象日: ${today}（JST）`);

  if (!ENABLED) {
    line("AUTO_COLUMN_ENABLED=false のため、APIを呼ばずに終了します。");
    return 0;
  }
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    console.error(
      "✖ ANTHROPIC_API_KEY が設定されていません。GitHub Secrets もしくは .env.local に設定してください。",
    );
    return 1;
  }

  try {
    const result = await runGeneration({
      dryRun: DRY_RUN,
      today,
      enabled: ENABLED,
      maxPerDay: MAX_PER_DAY,
      minLength: MIN_LENGTH,
      maxLength: MAX_LENGTH,
      log: (m) => line(`  · ${m}`),
    });
    return reportResult(result);
  } catch (err) {
    const type =
      err instanceof AnthropicError
        ? err.type
        : (err as Error)?.name === "ColumnParseError"
          ? "json_parse"
          : "unknown";
    console.error(`✖ 生成に失敗しました（${type}）: ${(err as Error).message}`);
    if (!DRY_RUN) {
      await appendErrorLog(today, type).catch(() => {});
    }
    return 1;
  }
}

/* ------------------------------ validate-only（オフライン自己テスト） ------------------------------ */

const KNOWN_STATIC_ROUTES = new Set([
  "/",
  "/jobs",
  "/work",
  "/benefits",
  "/beginner",
  "/independence-support",
  "/faq",
  "/company",
  "/apply",
  "/recruitment-policy",
  "/editorial-policy",
  "/privacy",
  "/column",
]);

/** 既存コラムの健全性チェック（重複・リンク切れ・画像欠落など） */
async function checkCorpusHealth(): Promise<string[]> {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const titles = new Set<string>();
  const jobSlugs = new Set(getActiveAreas().map((a) => a.slug));
  const allColumnSlugs = new Set(columnArticles.map((a) => a.slug));

  for (const a of publishedColumnArticles) {
    if (slugs.has(a.slug)) errors.push(`slug重複: ${a.slug}`);
    slugs.add(a.slug);
    if (titles.has(a.title)) errors.push(`title重複: ${a.title}`);
    titles.add(a.title);

    for (const rel of a.related) {
      if (!allColumnSlugs.has(rel)) errors.push(`${a.slug}: 関連記事slugが存在しない → ${rel}`);
    }

    // 画像の存在
    if (a.image) {
      const abs = path.join(process.cwd(), "public", a.image.replace(/^\//, ""));
      try {
        await fs.access(abs);
      } catch {
        errors.push(`${a.slug}: 画像が存在しない → ${a.image}`);
      }
    }

    // 内部リンク（ctaブロック）
    for (const b of a.blocks) {
      if (b.type !== "cta") continue;
      const href = b.href;
      if (!href.startsWith("/")) continue; // 外部は対象外
      const jobMatch = href.match(/^\/jobs\/([a-z0-9-]+)$/);
      const colMatch = href.match(/^\/column\/([a-z0-9-]+)$/);
      if (jobMatch) {
        if (!jobSlugs.has(jobMatch[1])) errors.push(`${a.slug}: 募集中でないエリアへのリンク → ${href}`);
      } else if (colMatch) {
        if (!allColumnSlugs.has(colMatch[1])) errors.push(`${a.slug}: 存在しない記事へのリンク → ${href}`);
      } else if (!KNOWN_STATIC_ROUTES.has(href.split("?")[0])) {
        errors.push(`${a.slug}: 未知の内部リンク → ${href}`);
      }
    }
  }
  return errors;
}

/** 選定テーマ向けの構造的に妥当なフィクスチャ（本文を伴う構造テスト用・保存しない） */
function buildFixture(topicTitle: string, mainKeyword: string, needsSourceIds: string[]): GeneratedColumn {
  const kw = mainKeyword.split(/\s+/).slice(-1)[0] || "軽貨物";
  const para = (seed: string) =>
    `${seed}について、実際の流れに沿って具体的に整理します。${kw}は人によって感じ方が異なるため、` +
    `事前に全体像をつかんでおくと、応募後の判断がしやすくなります。作業の目的や手順、つまずきやすい点を一つずつ確認し、` +
    `わからない部分は面談時に質問できるよう、あらかじめメモにまとめておく進め方が現実的です。` +
    `業務委託として働く場合は、報酬が経費控除前の金額である点や、車両リースには契約条件がある点もあわせて押さえておくと、` +
    `後から条件を確認し直す手間を減らせます。無理のない範囲で少しずつ慣れていくことを前提に計画を立てると続けやすくなります。`;
  const section = (heading: string, s1: string, s2: string) => ({
    heading,
    content: `${para(s1)}\n\n${para(s2)}`,
    subsections: [],
  });

  return {
    title: topicTitle,
    description:
      `${topicTitle}について、応募前に知っておきたい基本と確認点を、業務委託の軽貨物ドライバーの視点から具体的に整理して解説します。報酬や車両リース、面談での確認事項もあわせて紹介し、初めての方にもわかりやすくまとめました。`,
    tags: ["軽貨物ドライバー", "業務委託", "東京・千葉"],
    introduction:
      `結論として、${topicTitle.replace(/とは.*$/, "")}はポイントを押さえれば無理なく理解できます。この記事では、基本の考え方から実際の手順、注意点までを順番に確認していきます。`,
    sections: [
      section("基本の考え方", "まず全体像", "次に前提"),
      section("具体的な手順", "準備の段階", "実際の作業"),
      section("注意したい点", "見落としやすい点", "トラブルを避ける工夫"),
      section("株式会社ウィランの求人との関係", "募集条件との対応", "面談での確認"),
      section("まとめ", "要点の振り返り", "次のアクション"),
    ],
    checklist: [
      "報酬は経費控除前の金額であることを理解しているか",
      "車両リースの契約条件を確認したか",
      "勤務時間と稼働日数の希望を整理したか",
      "面談で質問したい項目をメモしたか",
    ],
    faq: [
      { question: "未経験でも始められますか。", answer: "普通自動車運転免許があれば応募でき、横乗り研修から始められます。詳細は面談で確認できます。" },
      { question: "報酬はどのように決まりますか。", answer: "エリアごとの日額保証があり、規定に沿って支払われます。手取りは経費や稼働日数で変わります。" },
    ],
    relatedJobSlugs: [],
    relatedArticleSlugs: [],
    sourceIds: needsSourceIds,
  };
}

async function runValidateMode(): Promise<number> {
  const today = todayJst();
  line("▶ コラム自動生成システムの自己テスト（APIは呼びません）");
  line("");

  let failed = false;

  // 1) 設定チェック
  line("■ 設定");
  line(`  AUTO_COLUMN_ENABLED:   ${ENABLED}`);
  line(`  AUTO_COLUMN_MAX_PER_DAY: ${MAX_PER_DAY}`);
  line(`  本文長さ: ${MIN_LENGTH}〜${MAX_LENGTH}`);
  line(`  登録済み出典: ${registeredSourceIds.join(", ")}`);
  line(`  画像カタログ: ${columnImages.length}枚`);
  line("");

  // 2) コーパス健全性
  line("■ 既存コラムの健全性");
  const health = await checkCorpusHealth();
  if (health.length === 0) {
    line(`  OK（${publishedColumnArticles.length}記事・重複/リンク切れ/画像欠落なし）`);
  } else {
    failed = true;
    for (const e of health) line(`  ✖ ${e}`);
  }
  line("");

  // 3) テーマ選定
  line("■ テーマ選定");
  const history = await loadHistory();
  const corpus = buildCorpus(history);
  const topic = selectTopic(corpus);
  if (!topic) {
    line("  未使用テーマがありません（全消化済み）。新規テーマの追加を検討してください。");
    line("");
    return failed ? 1 : 0;
  }
  line(`  次に生成されるテーマ: [${topic.id}] ${topic.title}`);
  line(`  カテゴリ: ${topic.category} / 出典必須: ${topic.needsSources ? "はい" : "いいえ"}`);
  line("");

  // 4) 組み立てパイプライン（フィクスチャで検証・保存しない）
  line("■ 組み立てパイプライン（フィクスチャ）");
  const fixture = buildFixture(topic.title, topic.mainKeyword, topic.needsSources ? topic.sourceIds : []);
  const assembled = assembleArticle(fixture, topic, corpus, {
    today,
    minLength: MIN_LENGTH,
    maxLength: MAX_LENGTH,
  });
  if (!assembled.ok) {
    failed = true;
    line(`  ✖ 組み立て失敗: ${assembled.reason}${assembled.detail ? ` — ${assembled.detail}` : ""}`);
    for (const e of assembled.errors ?? []) line(`     - ${e}`);
  } else {
    line(`  OK 検証・重複・画像・リンク・ブロック変換すべて通過`);
    line(`     本文文字数: ${assembled.bodyLength}`);
    line(`     画像: ${assembled.image.path}`);
    line(`     関連記事: ${assembled.article.related.join(", ")}`);
    line(`     関連求人: ${assembled.article.relatedJobs?.join(", ") || "-"}`);
    line(`     ブロック数: ${assembled.article.blocks.length}`);
    // レンダリング（文字列化）まで通ることを確認
    const rendered = renderArticleFile(assembled.article);
    line(`     TSファイル生成: ${rendered.length} bytes（構文OK）`);
    if (assembled.warnings.length) {
      for (const w of assembled.warnings) line(`     ⚠ ${w}`);
    }
  }
  line("");

  line(failed ? "結果: NG（上記を修正してください）" : "結果: OK（ライブAPI呼び出し以外のパイプラインは正常）");
  return failed ? 1 : 0;
}

/* ------------------------------ エントリ ------------------------------ */

async function main(): Promise<void> {
  let code: number;
  if (VALIDATE_ONLY) {
    code = await runValidateMode();
  } else {
    code = await runGenerateMode();
  }
  process.exit(code);
}

main().catch((err) => {
  console.error("✖ 予期しないエラー:", (err as Error).message);
  process.exit(1);
});
