import Link from "next/link";
import { getSpotlightArea } from "@/lib/jobs";

/**
 * 注力エリア（今月強化中）の案内。データに spotlight エリアが無ければ描画しない。
 * 誇大な緊急性は書かず、会社が実際に強化しているエリアへの導線として使う。
 */
export function SpotlightCallout() {
  const area = getSpotlightArea();
  if (!area || !area.spotlightNote) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border-2 border-primary/30 bg-mint">
      <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-primary-dark px-3 py-1 text-xs font-black tracking-wider text-white">
            今月の注力エリア
          </span>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">
            {area.spotlightNote}
          </p>
        </div>
        <Link
          href={`/jobs/${area.slug}`}
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-primary-dark px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {area.shortName}の求人（{area.dailyPayLabel}）を見る
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3.5L10.5 8L6 12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
