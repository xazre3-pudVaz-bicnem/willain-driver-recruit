"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** 送信完了ページ表示時に応募完了イベントを送信する */
export function ApplySubmitTracker() {
  useEffect(() => {
    trackEvent("apply_submit", { status: "complete" });
  }, []);
  return null;
}
