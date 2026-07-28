/**
 * コンバージョン計測ヘルパー。
 * GA4（gtag）またはGTM（dataLayer）が読み込まれている場合のみ送信し、
 * 未設定でもエラーにならない。
 */

export type TrackEventName =
  | "tel_click"
  | "phone_click"
  | "apply_click"
  | "apply_button_click"
  | "apply_submit"
  | "instagram_click"
  | "area_job_click"
  | "job_view"
  | "form_start"
  | "form_submit"
  | "form_error"
  | "column_to_job_click"
  | "job_to_apply_click";

type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(name: TrackEventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    }
  } catch {
    // 計測は本体機能に影響させない
  }
}
