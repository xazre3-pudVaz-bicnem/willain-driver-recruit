/**
 * Google Indexing API 通知スクリプト（任意実行）
 *
 * 求人ページ（JobPostingを実装したページのみ）の追加・更新・募集終了を
 * Googleへ通知する。通常の会社ページ・コラムページには使用しないこと。
 *
 * 使い方:
 *   npm run indexing:update            # 全求人ページを URL_UPDATED で通知
 *   npm run indexing:delete            # 全求人ページを URL_DELETED で通知（募集終了時）
 *   node scripts/google-indexing.ts update shinagawa   # 特定エリアのみ
 *
 * 必要な環境変数（.env.local にも記述可）:
 *   GOOGLE_INDEXING_CLIENT_EMAIL / GOOGLE_INDEXING_PRIVATE_KEY / NEXT_PUBLIC_SITE_URL
 *
 * Node.js 22.18以降（本プロジェクトはNode 24想定）で追加パッケージなしで動作する。
 */

import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * JobPostingを実装している求人ページのルート一覧。
 * lib/jobs.ts の jobAreas と必ず同期させること。
 */
const JOB_ROUTES: string[] = [
  "/jobs/shinagawa",
  "/jobs/koto",
  "/jobs/kasai",
  "/jobs/funabashi",
];

/* ---------- .env.local / .env の簡易読み込み ---------- */
function loadEnvFile(file: string): void {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvFile(".env.local");
loadEnvFile(".env");

/* ---------- サービスアカウントJWTでアクセストークンを取得 ---------- */
function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  // 環境変数では改行が \n で入っているため復元する
  const signature = base64url(signer.sign(privateKey.replace(/\\n/g, "\n")));
  const jwt = `${header}.${claims}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`アクセストークンの取得に失敗しました: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/* ---------- 本体 ---------- */
async function main(): Promise<void> {
  const mode = process.argv[2];
  const filter = process.argv.slice(3);

  if (mode !== "update" && mode !== "delete") {
    console.error("使い方: node scripts/google-indexing.ts <update|delete> [エリアslug...]");
    process.exit(1);
  }

  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

  if (!clientEmail || !privateKey || !siteUrl) {
    console.error(
      [
        "環境変数が不足しています。以下を .env.local に設定してください:",
        "  GOOGLE_INDEXING_CLIENT_EMAIL（サービスアカウントのメールアドレス）",
        "  GOOGLE_INDEXING_PRIVATE_KEY（サービスアカウントの秘密鍵）",
        "  NEXT_PUBLIC_SITE_URL（公開サイトURL）",
        "設定手順はREADME.mdの「Google Indexing API」の章を参照してください。",
      ].join("\n")
    );
    process.exit(1);
  }

  const routes =
    filter.length > 0
      ? JOB_ROUTES.filter((r) => filter.some((f) => r.endsWith(`/${f}`)))
      : JOB_ROUTES;

  if (routes.length === 0) {
    console.error(`対象ページが見つかりません。指定可能なslug: ${JOB_ROUTES.join(", ")}`);
    process.exit(1);
  }

  const type = mode === "update" ? "URL_UPDATED" : "URL_DELETED";
  console.log(`Google Indexing APIへ ${type} を通知します（${routes.length}件）`);

  const token = await getAccessToken(clientEmail, privateKey);
  let failed = 0;

  for (const route of routes) {
    const url = `${siteUrl}${route}`;
    const res = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type }),
      }
    );
    if (res.ok) {
      console.log(`  OK   ${url}`);
    } else {
      failed += 1;
      console.error(`  NG   ${url} → ${res.status} ${await res.text()}`);
    }
  }

  if (failed > 0) {
    console.error(`${failed}件の通知に失敗しました。`);
    process.exit(1);
  }
  console.log("すべての通知が完了しました。");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
