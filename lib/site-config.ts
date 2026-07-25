/**
 * サイト全体の基本情報を一元管理するファイル。
 * 会社情報・連絡先・SNS・URLはすべてここを変更すれば全ページに反映される。
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │ 【公開前確認事項】                                        │
 * │ 本社所在地・営業拠点所在地を株式会社ウィランへ最終確認する。 │
 * │ Instagram等に別所在地が掲載されている可能性があるため、     │
 * │ 下記 address を確定情報に更新してから公開すること。         │
 * └─────────────────────────────────────────────────────────┘
 */

/**
 * サイトURLの解決（canonical・sitemap・構造化データの基点）。
 * 優先順位:
 *   1. NEXT_PUBLIC_SITE_URL（独自ドメイン確定後は必ずこれを設定する）
 *   2. Vercelの本番ドメイン（VERCEL_PROJECT_PRODUCTION_URL。自動提供）
 *   3. Vercelのデプロイ別URL（VERCEL_URL。プレビュー用）
 *   4. localhost（ローカル開発・ローカルビルド）
 * Vercel以外のCIで本番ビルドする場合のみ、未設定を検知してビルドを失敗させ、
 * canonicalがlocalhostのまま公開される事故を防ぐ。
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (
    typeof window === "undefined" &&
    process.env.NODE_ENV === "production" &&
    process.env.CI
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL が未設定です。公開ビルドでは必ず本番URLを設定してください（README「環境変数」参照）。"
    );
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  /** 会社正式名称 */
  companyName: "株式会社ウィラン",
  /** 英語・ブランド表記 */
  brandName: "Willain",
  /** 電話番号（表示用） */
  phoneDisplay: "080-7297-3908",
  /** 電話番号（tel:リンク用） */
  phoneLink: "tel:08072973908",
  /** 電話番号（E.164国際表記。構造化データ用） */
  phoneE164: "+81-80-7297-3908",
  /** 電話受付の補足表記 */
  phoneNote: "配送中は折り返しになる場合があります",

  /**
   * 本社所在地
   * ※【公開前確認事項】株式会社ウィランへ最終確認のうえ確定させること
   */
  address: {
    postalCode: "〒104-0061",
    region: "東京都",
    locality: "中央区",
    street: "銀座1丁目12番4号 N&E BLD.6F",
    /** 1行表記 */
    full: "東京都中央区銀座1丁目12番4号 N&E BLD.6F",
  },

  /** 事業内容 */
  business: "軽貨物配送事業（宅配・企業配送）",

  /** 公式Instagram（一元管理） */
  instagramUrl: "https://www.instagram.com/willain_official/",
  instagramHandle: "@willain_official",

  /**
   * サイトURL（末尾スラッシュなし）
   * 公開時は環境変数 NEXT_PUBLIC_SITE_URL を必ず設定する。
   */
  siteUrl: resolveSiteUrl(),

  /** サイト名（title等で使用） */
  siteName: "株式会社ウィラン 採用サイト",

  /**
   * サイト全体の最終更新日（sitemapのlastmodに使用）。
   * ビルド日時で自動更新せず、実際にコンテンツを更新した日に手動で変更する。
   */
  siteLastModified: "2026-07-25",
} as const;

/** 絶対URLを生成する（canonical・OG・構造化データ用） */
export function absoluteUrl(path: string): string {
  if (path === "/") return siteConfig.siteUrl;
  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
