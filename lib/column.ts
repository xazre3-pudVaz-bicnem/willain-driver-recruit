/**
 * 採用コラムの型定義。
 * 記事本文は構造化ブロックで管理し、レンダリングは共通コンポーネントが行う。
 * 公開日（publishedAt）と更新日（updatedAt）は分けて管理する。
 */

export type ColumnBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  /** 注意書き（税務・法務など断定を避けるべき事項の補足） */
  | { type: "note"; text: string }
  /** 求人ページ等への内部リンク誘導 */
  | { type: "cta"; href: string; label: string; text?: string }
  /** 公式出典リスト（制度・税務・法務記事の参考情報） */
  | {
      type: "sources";
      items: { name: string; url: string; checkedDate: string }[];
    };

export type ColumnCategory =
  | "仕事内容"
  | "働き方・契約"
  | "お金・報酬"
  | "独立・キャリア";

export type ColumnArticle = {
  /** URLスラッグ（/column/[slug]） */
  slug: string;
  /** 記事タイトル（H1） */
  title: string;
  /** meta description（120文字以内目安） */
  description: string;
  category: ColumnCategory;
  /** 公開日（YYYY-MM-DD） */
  publishedAt: string;
  /** 更新日（YYYY-MM-DD） */
  updatedAt: string;
  /** 関連記事のスラッグ（3件） */
  related: string[];
  blocks: ColumnBlock[];

  /* ------- 以下は自動生成記事のメタ情報（既存記事では未設定＝デフォルト扱い） ------- */
  /** 記事の代表写真（public配下・AI生成のイメージ画像） */
  image?: string;
  /** 代表写真のalt（実写ではないため「〜のイメージ」と表記） */
  imageAlt?: string;
  /** タグ（内部管理・任意表示） */
  tags?: string[];
  /** 著者（既定「株式会社ウィラン 採用担当」） */
  author?: string;
  /** 公開状態（既定 published。draft は一覧・sitemap・RSSから除外） */
  status?: "published" | "draft";
  /** 生成モデル（内部管理・画面非表示） */
  generatedBy?: string;
  /** メインキーワード（カニバリ判定用） */
  mainKeyword?: string;
  /** サブキーワード */
  subKeywords?: string[];
  /** 検索意図（カニバリ判定用） */
  searchIntent?: string;
  /** 関連する募集中エリアのslug */
  relatedJobs?: string[];
  /** 参照した公式出典のID（official-sources） */
  sourceIds?: string[];
};
