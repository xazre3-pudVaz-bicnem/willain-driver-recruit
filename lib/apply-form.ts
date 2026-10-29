import { jobAreas } from "@/lib/jobs";

/**
 * 応募フォームの選択肢・状態型。
 * サーバーアクションとクライアントフォームの双方から参照する。
 */

export type ApplyFormState = {
  /** フィールド名 → 日本語エラーメッセージ */
  errors: Record<string, string>;
  /** フォーム全体のエラー（送信失敗など） */
  formError?: string;
  /** 再入力の手間を減らすため入力値を保持する */
  values: Record<string, string>;
};

export const initialApplyFormState: ApplyFormState = { errors: {}, values: {} };

/**
 * 自転車での配送スタッフ（募集がある拠点のみ）。軽貨物ドライバーとは別の募集として選べるようにする。
 * ?area=[slug]-bicycle（例: chofu-bicycle）で選択済みにできる。
 */
const bicycleOptions = jobAreas
  .filter((a) => a.bicycleStaff)
  .map((a) => ({
    slug: `${a.slug}-bicycle`,
    value: `${a.shortName}（自転車）`,
    label: `${a.areaName}（自転車での配送スタッフ）`,
  }));

export const areaOptions = [
  ...jobAreas.map((a) => ({ value: a.shortName, label: a.areaName })),
  ...bicycleOptions.map(({ value, label }) => ({ value, label })),
  { value: "その他", label: "その他・相談したい" },
];

/** 自転車での配送スタッフの希望か（応募通知の件名を分けるため） */
export function isBicycleArea(value: string): boolean {
  return bicycleOptions.some((o) => o.value === value);
}

/** URLの ?area=slug（例: shinagawa）→ フォームの選択肢値（shortName）へ変換 */
const slugToShortName: Record<string, string> = Object.fromEntries([
  ...jobAreas.map((a) => [a.slug, a.shortName]),
  ...bicycleOptions.map((o) => [o.slug, o.value]),
]);

/** ?area= の値（slug or shortName）を有効な選択肢値に正規化する。無効なら空文字。 */
export function resolveAreaParam(param: string | null | undefined): string {
  if (!param) return "";
  if (slugToShortName[param]) return slugToShortName[param];
  if (areaOptions.some((o) => o.value === param)) return param;
  return "";
}

export const AREA_VALUES = areaOptions.map((o) => o.value);
export const LICENSE_VALUES = ["あり（AT限定を含む）", "なし"];
export const VEHICLE_VALUES = [
  "持っている",
  "持っていない（リース希望）",
  "相談したい",
];
export const WORKDAYS_VALUES = ["週3日", "週4日", "週5日", "週6日", "相談したい"];
export const START_VALUES = [
  "すぐにでも",
  "1ヶ月以内",
  "2〜3ヶ月以内",
  "未定・情報収集中",
];
