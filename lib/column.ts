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
  | { type: "cta"; href: string; label: string; text?: string };

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
};
