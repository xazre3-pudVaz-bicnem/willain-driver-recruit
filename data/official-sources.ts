/**
 * 自動生成コラムで参照できる「公式出典」ホワイトリスト。
 *
 * 税務・法務・保険・運送事業などの制度テーマでは、Claudeに最新情報を検索させず、
 * ここに登録された公式機関のみを出典として提示する。
 * 登録されていない制度テーマは記事化せず、別の一般テーマを選ぶ（generator側で制御）。
 *
 * URLは省庁・公的機関の安定したトップ／セクションURLのみを登録する
 * （深いパスはリンク切れリスクがあるため使わない）。
 * checkedDate は「登録・確認した日」。制度の内容そのものの鮮度保証ではない。
 */

export type OfficialSource = {
  /** 安定ID（記事の sourceIds から参照） */
  id: string;
  /** 表示名（機関名） */
  name: string;
  /** 参照先URL（公式ドメインのみ） */
  url: string;
  /** リンク確認日（YYYY-MM-DD） */
  checkedDate: string;
  /** どんなテーマで参照するかの内部メモ */
  scope: string;
};

export const officialSources: OfficialSource[] = [
  {
    id: "nta",
    name: "国税庁",
    url: "https://www.nta.go.jp/",
    checkedDate: "2026-07-29",
    scope: "確定申告・青色申告・開業届・所得税・インボイス制度・消費税",
  },
  {
    id: "invoice",
    name: "国税庁 インボイス制度 特設サイト",
    url: "https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice.htm",
    checkedDate: "2026-07-29",
    scope: "インボイス制度（適格請求書等保存方式）",
  },
  {
    id: "mlit",
    name: "国土交通省",
    url: "https://www.mlit.go.jp/",
    checkedDate: "2026-07-29",
    scope: "自動車・運送事業に関する制度全般",
  },
  {
    id: "unyu",
    name: "国土交通省 地方運輸局・運輸支局",
    url: "https://www.mlit.go.jp/about/related.html",
    checkedDate: "2026-07-29",
    scope: "貨物軽自動車運送事業の届出・黒ナンバー（事業用軽自動車）",
  },
  {
    id: "egov",
    name: "e-Gov法令検索（デジタル庁）",
    url: "https://laws.e-gov.go.jp/",
    checkedDate: "2026-07-29",
    scope: "貨物自動車運送事業法・道路運送車両法などの条文確認",
  },
  {
    id: "jftc",
    name: "公正取引委員会",
    url: "https://www.jftc.go.jp/",
    checkedDate: "2026-07-29",
    scope: "フリーランス・事業者間取引の適正化（業務委託契約の考え方）",
  },
  {
    id: "mhlw",
    name: "厚生労働省",
    url: "https://www.mhlw.go.jp/",
    checkedDate: "2026-07-29",
    scope: "フリーランスとして働く人の保護・社会保険・労働関連",
  },
  {
    id: "nenkin",
    name: "日本年金機構",
    url: "https://www.nenkin.go.jp/",
    checkedDate: "2026-07-29",
    scope: "国民年金・厚生年金など公的年金の手続き",
  },
];

const sourceMap = new Map(officialSources.map((s) => [s.id, s]));

export function getSource(id: string): OfficialSource | undefined {
  return sourceMap.get(id);
}

export const registeredSourceIds: string[] = officialSources.map((s) => s.id);

/** 記事末尾に必ず表示する免責文（制度テーマの有無に関わらず出典セクションで使用） */
export const SOURCE_DISCLAIMER =
  "制度や手続きは変更される場合があります。最新情報は国税庁、国土交通省、管轄の運輸支局、税理士などへご確認ください。";
