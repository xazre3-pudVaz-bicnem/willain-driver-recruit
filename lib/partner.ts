import type { FaqItem } from "@/lib/faq";
import type { ApplyFormState } from "@/lib/apply-form";

/**
 * 協力会社・パートナー・フランチャイズ募集ページ（/partner）の単一データソース。
 * 画面表示・FAQPage構造化データ・問い合わせフォームの選択肢は、すべてこのファイルから生成する。
 *
 * 【公開前確認事項】
 * - 掲載内容は株式会社ウィランから受領した回答（2026-10-23）のみ。架空の数字・事例・声は追加しない。
 * - 加盟金・ロイヤリティの金額、お支払い期日は契約ごとに決めるため掲載しない（2026-10-26 ウィラン指示）。
 * - 収入・売上の見込みや「稼げる」「儲かる」「確実」「保証」などの表現は使わない（特にフランチャイズ）。
 * - Amazonの公式パートナーと誤解させる表現・ロゴは使わない（サイト既存の「Amazon関連」表記に合わせる）。
 */

/** ページの最終更新日（sitemap・WebPage構造化データに使用。内容を変えた日に手動で更新する） */
export const partnerPageUpdatedAt = "2026-10-29";

export const partnerSeo = {
  /** titleタグ（layoutのテンプレートで「｜株式会社ウィラン」が付く） */
  title: "軽貨物の協力会社・パートナー・フランチャイズ募集",
  description:
    "株式会社ウィランの協力会社（法人）・パートナー（個人事業主・チーム）・フランチャイズ加盟の募集ページです。主にAmazon関連の個人宅配送の案件を、1台1日あたりの日額でお任せします。黒ナンバーの届出や車両リースもサポートします。",
  ogTitle: "協力会社・パートナー・フランチャイズ募集｜株式会社ウィラン",
  ogDescription:
    "軽貨物の協力会社・パートナー・フランチャイズを募集しています。主にAmazon関連の個人宅配送の案件をご紹介します。",
  keywords: [
    "軽貨物 協力会社 募集",
    "軽貨物 パートナー 募集",
    "軽貨物 フランチャイズ",
    "軽貨物 案件 紹介",
  ],
  /** H1（語の途中で改行されないよう、表示は句ごとに分けて組む。連結すると h1 と一致） */
  h1Phrases: ["軽貨物の協力会社・", "パートナー・", "フランチャイズ募集"],
  h1: "軽貨物の協力会社・パートナー・フランチャイズ募集",
};

/** ヒーロー写真（AI生成のイメージ画像のため alt は「〜のイメージ」と表記） */
export const partnerHeroImage = {
  src: "/images/photos/warehouse.webp",
  alt: "配送センターの前に停まる軽バンと荷物のイメージ",
};

/* ---------------- 実績 ---------------- */

/** 実績の基準時点（数字を更新したら合わせて変更する） */
export const partnerStatsAsOf = "2026年10月時点";

/**
 * 稼働中の拠点・新しく開設した拠点・開設予定の拠点。
 * 稼働拠点の数には、ドライバーが稼働している拠点だけを数える（開設したばかりの拠点・予定の拠点は含めない）。
 */
export const partnerActiveBases = "品川・江東・江戸川・船橋";
/** 開設済みで、ドライバーの募集を始めた拠点（2026-10-29 ウィラン確認。稼働が始まったら partnerActiveBases へ移す） */
export const partnerOpeningBases = "世田谷・調布・横浜";
export const partnerPlannedBases = "足立";

export const partnerStats = {
  bases: {
    label: "稼働拠点",
    value: "4",
    unit: "拠点",
    note: `${partnerOpeningBases}で新規開設、${partnerPlannedBases}に開設予定。今後、全国に拡大予定`,
  },
  companies: { label: "協力会社", value: "3", unit: "社" },
  vehicles: { label: "稼働台数", value: "約20", unit: "台" },
} as const;

/* ---------------- 募集区分 ---------------- */

export type PartnerType = {
  /** URLの ?type= と、フォームの初期選択に使う */
  slug: "franchise" | "company" | "partner";
  /** 区分名（見出し・フォームの選択肢） */
  label: string;
  /** 対象となる方 */
  target: string;
  /** 概要 */
  summary: string;
  /** ポイント（受領した事実のみ） */
  points: string[];
};

export const partnerTypes: PartnerType[] = [
  {
    slug: "franchise",
    label: "フランチャイズ加盟",
    target: "「ウィラン」の名前で、軽貨物配送の事業に取り組みたい方",
    summary: "「ウィラン」の名前を使って営業していただけます。",
    points: [
      "加盟金・ロイヤリティがかかります",
      "金額は契約内容に応じて、面談時に書面でご説明します",
    ],
  },
  {
    slug: "company",
    label: "協力会社（法人）",
    target: "軽貨物配送の事業を営む法人さま",
    summary: "主にAmazon関連の個人宅配送の案件をお任せします。",
    points: [
      "報酬は1台1日あたりの日額。金額は会社さまごとにご相談のうえ決めます",
      "請求などの事務作業もサポートします",
    ],
  },
  {
    slug: "partner",
    label: "パートナー（個人事業主・チーム）",
    target: "個人事業主の方、ドライバーのチームを持つ方",
    summary: "普通自動車免許があれば始められます。",
    points: [
      "報酬は1台1日あたりの日額。金額は個人さまごとにご相談のうえ決めます",
      "黒ナンバーの届出・保険の加入をサポートします",
      "軽バンのリース・車の購入代行に対応しています",
    ],
  },
];

/* ---------------- 案件と報酬 ---------------- */

/**
 * お支払い条件（ページ・FAQはこの定数だけを参照する。全募集共通）。
 * 期日は契約ごとに決めるため、具体的な日付は載せない（2026-10-26 ウィラン指示。法律面はウィランが顧問に確認）。
 */
export const partnerPaymentTerms = "お支払い条件は契約内容に応じて、ご契約前に書面でご案内します";

export const partnerConditions: { th: string; td: string }[] = [
  {
    th: "案件の内容",
    td: "主にAmazon関連の個人宅配送（インターネット通販の商品を、個人のお宅へ届ける配送）",
  },
  {
    th: "報酬の決め方",
    td: "1台1日あたりの日額。金額は会社さま・個人さまごとに、ご相談のうえ決めます",
  },
  { th: "お支払い", td: partnerPaymentTerms },
  { th: "契約", td: "契約条件は書面でご説明します" },
];

/* ---------------- 参加条件 ---------------- */

export const partnerRequirements: { title: string; text: string }[] = [
  {
    title: "普通自動車免許があればOK",
    text: "特別な資格がなくても始められます。",
  },
  {
    title: "黒ナンバーの届出はサポート",
    text: "軽貨物の配送に必要な黒ナンバー（貨物軽自動車運送事業の届出）は、ウィランがサポートします。",
  },
  {
    title: "保険の加入もサポート",
    text: "保険の加入手続きも、ウィランがサポートします。",
  },
];

/* ---------------- サポート ---------------- */

export const partnerSupports: { title: string; text: string }[] = [
  {
    title: "案件のご紹介",
    text: "主にAmazon関連の個人宅配送の案件をご紹介します。",
  },
  {
    title: "車両のご用意",
    text: "軽バンの貸し出し（リース）と、車の購入代行に対応しています。",
  },
  {
    title: "黒ナンバー・保険の手続き",
    text: "黒ナンバーの届出や、保険加入の手続きをサポートします。",
  },
  {
    title: "研修・稼働後のフォロー",
    text: "横乗りでの研修から始められます。稼働を始めたあともフォローします。",
  },
  {
    title: "事務のサポート",
    text: "請求などの事務作業もサポートします。",
  },
];

/* ---------------- 契約までの流れ ---------------- */

export const partnerFlow: { step: string; text: string }[] = [
  { step: "お問い合わせ", text: "フォームまたはお電話でご連絡ください。" },
  {
    step: "面接",
    text: "ご希望をうかがい、案件・報酬・契約の条件をご説明します。",
  },
  {
    step: "契約",
    text: "条件にご納得いただけたら、ご契約です。協力会社・パートナーは最短即日で契約できます。フランチャイズは、書面で条件をご説明したうえでのご契約になります。",
  },
];

export const partnerFlowNote = "いずれの区分も、契約条件は書面でご説明します。";

/* ---------------- よくある質問（FAQPage構造化データにも使用） ---------------- */

const { bases } = partnerStats;

export const partnerFaq: FaqItem[] = [
  {
    q: "フランチャイズに加盟金やロイヤリティはありますか？",
    a: "加盟金・ロイヤリティがかかります。金額は契約内容に応じて、面談時に書面でご説明します。",
  },
  {
    q: "フランチャイズに加盟すると「ウィラン」の名前を使えますか？",
    a: "使えます。フランチャイズに加盟いただいた方は、「ウィラン」の名前で営業していただけます。",
  },
  {
    q: "どのような案件がありますか？",
    a: "主にAmazon関連の個人宅配送です。インターネット通販の商品を、個人のお宅へお届けします。",
  },
  {
    q: "報酬はどのように決まりますか？",
    a: "1台1日あたりの日額でお支払いします。金額は会社さま・個人さまごとに、ご相談のうえ決めます。",
  },
  {
    q: "報酬の支払い条件を教えてください。",
    a: `${partnerPaymentTerms}。`,
  },
  {
    q: "黒ナンバーを持っていなくても始められますか？",
    a: "始められます。普通自動車免許があれば参加でき、黒ナンバーの届出や保険の加入はウィランがサポートします。",
  },
  {
    q: "車両を持っていなくても大丈夫ですか？",
    a: "大丈夫です。軽バンの貸し出し（リース）や、車の購入代行に対応しています。",
  },
  {
    q: "個人事業主でも申し込めますか？",
    a: "申し込めます。パートナーは、個人事業主の方と、ドライバーのチームを持つ方を対象にしています。",
  },
  {
    q: "どのエリアで稼働できますか？",
    a: `${partnerStatsAsOf}で、${partnerActiveBases}の${bases.value}${bases.unit}が稼働しています。${partnerOpeningBases}には新しい拠点を開設し、ドライバーの募集を始めました。${partnerPlannedBases}にも拠点を開設する予定で、今後は全国への拡大を予定しています。ご希望のエリアで稼働できるかは、面接時にご案内します。`,
  },
  {
    q: "問い合わせから契約まで、どのくらいかかりますか？",
    a: "お問い合わせ、面接、契約の順に進みます。協力会社・パートナーは最短即日で契約できます。フランチャイズは、書面で条件をご説明したうえでのご契約になります。いずれも契約条件は書面でご説明します。",
  },
];

/* ---------------- 問い合わせフォーム ---------------- */

/** フォームの状態型（応募フォームと同じ形） */
export type PartnerFormState = ApplyFormState;

export const initialPartnerFormState: PartnerFormState = { errors: {}, values: {} };

export const PARTNER_TYPE_VALUES = partnerTypes.map((t) => t.label);

/** ?type= の値（slug or 区分名）を有効な選択肢値に正規化する。無効なら空文字。 */
export function resolvePartnerTypeParam(param: string | null | undefined): string {
  if (!param) return "";
  const hit = partnerTypes.find((t) => t.slug === param || t.label === param);
  return hit ? hit.label : "";
}
