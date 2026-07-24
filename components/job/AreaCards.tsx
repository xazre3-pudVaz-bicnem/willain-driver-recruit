"use client";

import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import type { JobArea } from "@/lib/jobs";

/** エリアslug → 英字ラベル */
const romaji: Record<string, string> = {
  shinagawa: "SHINAGAWA",
  koto: "KOTO",
  kasai: "KASAI",
  funabashi: "FUNABASHI",
};

const shortLabel: Record<string, string> = {
  shinagawa: "品川区",
  koto: "江東区",
  kasai: "葛西・江戸川区",
  funabashi: "船橋市",
};

type AreaInput = Pick<
  JobArea,
  "slug" | "areaName" | "image" | "imageAlt" | "addressRegion"
>;

/**
 * 募集エリア。写真を敷いた濃色タイルに地名を大きく重ねる。
 * 均一な白カードは使わない。
 */
export function AreaCards({
  areas,
  currentSlug,
}: {
  areas: AreaInput[];
  currentSlug?: string;
}) {
  const visible = areas.filter((a) => a.slug !== currentSlug);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map((area) => (
        <Link
          key={area.slug}
          href={`/jobs/${area.slug}`}
          onClick={() => trackEvent("area_job_click", { area: area.slug })}
          data-event="area_job_click"
          data-area={area.slug}
          className="group relative flex min-h-[220px] items-end overflow-hidden rounded-md md:min-h-[260px]"
        >
          <Image
            src={area.image}
            alt={area.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-ink/85 via-emerald-ink/40 to-emerald-ink/10" />
          <div className="relative w-full p-6">
            <p className="text-xs font-black tracking-[0.2em] text-primary-light">
              {romaji[area.slug] ?? ""}
            </p>
            <h3 className="mt-1 text-2xl font-black text-white md:text-3xl">
              {shortLabel[area.slug] ?? area.areaName}
            </h3>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white">
              求人詳細を見る
              <svg
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
          </div>
        </Link>
      ))}
    </div>
  );
}
