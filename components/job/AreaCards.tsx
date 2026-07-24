"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { JobArea } from "@/lib/jobs";

/**
 * 募集エリアカード。クリックはarea_job_clickとして計測する。
 * クライアント境界を最小にするため、データはpropsで受け取る。
 */
export function AreaCards({
  areas,
  currentSlug,
}: {
  areas: Pick<JobArea, "slug" | "areaName" | "h1" | "metaDescription">[];
  currentSlug?: string;
}) {
  const visible = areas.filter((a) => a.slug !== currentSlug);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visible.map((area) => (
        <Link
          key={area.slug}
          href={`/jobs/${area.slug}`}
          onClick={() => trackEvent("area_job_click", { area: area.slug })}
          data-event="area_job_click"
          data-area={area.slug}
          className="group rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
        >
          <p className="text-xs font-bold tracking-wider text-primary">
            募集中エリア
          </p>
          <h3 className="mt-1.5 text-lg leading-snug font-black text-ink group-hover:text-primary">
            {area.areaName}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-sub">
            {area.metaDescription}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
            求人詳細を見る
            <svg
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
