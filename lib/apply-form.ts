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

export const areaOptions = [
  ...jobAreas.map((a) => ({ value: a.shortName, label: a.areaName })),
  { value: "その他", label: "その他・相談したい" },
];

/** URLの ?area=slug（例: shinagawa）→ フォームの選択肢値（shortName）へ変換 */
const slugToShortName: Record<string, string> = Object.fromEntries(
  jobAreas.map((a) => [a.slug, a.shortName])
);

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
