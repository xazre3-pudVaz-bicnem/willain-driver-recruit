"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** 求人詳細ページ表示時に job_view を1回計測する（GA4/GTM未設定でも無害）。 */
export function JobViewTracker({
  jobId,
  jobArea,
}: {
  jobId: string;
  jobArea: string;
}) {
  useEffect(() => {
    trackEvent("job_view", { job_id: jobId, job_area: jobArea });
  }, [jobId, jobArea]);
  return null;
}
