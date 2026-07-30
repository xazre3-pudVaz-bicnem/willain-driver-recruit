/**
 * 株式会社ウィランの一次情報（採用担当が実際に確認している内容）を入れる場所。
 *
 * ここに入れた「確認済み」の内容だけがサイトに表示される。
 * 未入力（items が空、または confirmed:false）のセクションは一切表示しない
 * （空セクションやダミー文章を出さない）。
 *
 * 管理画面は不要。ここを編集して items を追記し confirmed:true にすれば表示される。
 * 架空の内容は入れないこと（実際に確認できた事実のみ）。
 */

export type FirstPartySection = {
  /** 参照ID（コンポーネントから指定） */
  id: string;
  /** 表示見出し */
  heading: string;
  /** 導入文（任意） */
  intro?: string;
  /** 箇条書きの中身（確認済みの事実のみ） */
  items: string[];
  /** true かつ items が1件以上のときだけ表示 */
  confirmed: boolean;
  /** 確認日（任意・監査用） */
  confirmedAt?: string;
};

export const firstPartyContent: FirstPartySection[] = [
  {
    id: "interview-faq",
    heading: "採用担当によく寄せられる質問",
    intro: "面談前に多くいただく質問です。",
    items: [], // 例: "車を持っていなくても始められますか？ → …"
    confirmed: false,
  },
  {
    id: "interview-consult",
    heading: "面談で多いご相談",
    items: [],
    confirmed: false,
  },
  {
    id: "beginner-stumble",
    heading: "未経験の方が最初につまずきやすい点",
    items: [],
    confirmed: false,
  },
  {
    id: "training-checklist",
    heading: "横乗り研修で確認していること",
    items: [],
    confirmed: false,
  },
  {
    id: "loading-tips",
    heading: "荷物の積み方でお伝えしていること",
    items: [],
    confirmed: false,
  },
  {
    id: "app-first-steps",
    heading: "配送アプリで最初に覚えること",
    items: [],
    confirmed: false,
  },
  {
    id: "lease-conditions",
    heading: "車両リースで説明している条件",
    items: [],
    confirmed: false,
  },
  {
    id: "start-preparation",
    heading: "稼働開始までに必要な準備",
    items: [],
    confirmed: false,
  },
  {
    id: "before-interview",
    heading: "応募者が面談前に確認しておくとよいこと",
    items: [],
    confirmed: false,
  },
];

const byId = new Map(firstPartyContent.map((s) => [s.id, s]));

/** 確認済みかつ内容があるセクションだけ返す（無ければ undefined） */
export function getFirstPartySection(id: string): FirstPartySection | undefined {
  const s = byId.get(id);
  if (!s || !s.confirmed || s.items.length === 0) return undefined;
  return s;
}
