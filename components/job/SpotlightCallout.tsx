import Link from "next/link";
import { getSpotlightAreas, spotlightMessage } from "@/lib/jobs";

/**
 * 注力エリア（今月強化中）の案内。データに spotlight エリアが無ければ描画しない。
 * 誇大な緊急性は書かず、会社が実際に強化しているエリアへの導線として使う。
 * 複数エリアのときは1枚の枠の中にエリアごとの行を並べる。
 */
export function SpotlightCallout() {
  const areas = getSpotlightAreas().filter((a) => spotlightMessage(a));
  if (areas.length === 0) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border-2 border-primary/30 bg-mint">
      <div className="px-6 py-5">
        <span className="inline-block rounded-full bg-primary-dark px-3 py-1 text-xs font-black tracking-wider text-white">
          今月の注力エリア
        </span>
        <ul className="mt-3 divide-y divide-primary/20">
          {areas.map((area) => (
            <li
              key={area.slug}
              className="flex flex-col gap-3 py-4 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-[0.95rem] leading-relaxed text-ink">
                {spotlightMessage(area)}
              </p>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
