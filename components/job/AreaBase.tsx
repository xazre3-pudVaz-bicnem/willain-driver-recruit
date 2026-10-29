import type { JobArea } from "@/lib/jobs";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/Kicker";
import { MapEmbed } from "@/components/job/MapEmbed";

/**
 * 拠点（集合場所）・稼働状況・主な配送エリア。
 * ウィランに確認済みの拠点データ（lib/jobs.ts の base / team / deliveryAreas）があるエリアだけで描画する。
 * 町名は配送エリアの例で、地域名での検索（「港南 軽貨物」など）の受け皿も兼ねる。
 * 新しく開設した拠点（opening）は、稼働人数の代わりにオープニングメンバーの募集として表示する。
 */
export function AreaBase({ area }: { area: JobArea }) {
  const { base, team, deliveryAreas, schedule, opening } = area;
  if (!base) return null;
  const startTime = schedule?.[0]?.time;
  const hasDeliveryAreas = (deliveryAreas?.length ?? 0) > 0;
  // 4区市はちょうど1段、5区市は3列で2段に収める
  const cityCols = deliveryAreas?.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Kicker animate>{hasDeliveryAreas ? `${base.name}と配送エリア` : base.name}</Kicker>
        <Reveal>
          <h2 className="h-section mb-10 text-ink">
            {hasDeliveryAreas ? "集合場所と、走るエリア。" : "集合場所と、拠点の状況。"}
          </h2>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <Reveal>
            <dl className="divide-y divide-line border-y border-line">
              <div className="py-5">
                <dt className="text-xs font-black tracking-wider text-primary-dark">集合場所</dt>
                <dd className="mt-1.5 text-lg font-black text-ink">{base.address}</dd>
                {base.access && (
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink-sub">{base.access}</dd>
                )}
              </div>
              {startTime && (
                <div className="py-5">
                  <dt className="text-xs font-black tracking-wider text-primary-dark">集合時間</dt>
                  <dd className="mt-1.5 text-lg font-black text-ink tabular-nums">
                    {startTime}（荷物の積み込みから）
                  </dd>
                </div>
              )}
              {team && (
                <div className="py-5">
                  <dt className="text-xs font-black tracking-wider text-primary-dark">
                    拠点の状況（{team.asOf}時点）
                  </dt>
                  <dd className="mt-2 flex flex-wrap items-baseline gap-x-8 gap-y-2">
                    {opening ? (
                      <span className="rounded-full bg-primary-dark px-3 py-1 text-sm font-black text-white">
                        新規開設・オープニングメンバー募集
                      </span>
                    ) : (
                      <span className="text-ink">
                        稼働中
                        <span className="ml-2 text-3xl font-black tabular-nums text-ink">
                          {team.activeDrivers}
                        </span>
                        <span className="ml-0.5 font-bold">名</span>
                      </span>
                    )}
                    <span className="text-ink">
                      募集
                      <span className="ml-2 text-3xl font-black tabular-nums text-primary-dark">
                        {team.openings}
                      </span>
                      <span className="ml-0.5 font-bold">名</span>
                    </span>
                  </dd>
                  {opening && (
                    <dd className="mt-2 text-sm leading-relaxed text-ink-sub">
                      新しく開設した拠点のため、稼働中のドライバーはまだいません。
                    </dd>
                  )}
                </div>
              )}
            </dl>
            {!base.exactAddress && (
              <p className="mt-4 text-sm leading-relaxed text-ink-sub">
                詳しい住所は、応募後の面談でご案内します。
              </p>
            )}
          </Reveal>
          <Reveal delay={0.08}>
            <MapEmbed query={base.address} title={`${base.name}（${base.address}）周辺の地図`} />
          </Reveal>
        </div>

        {!hasDeliveryAreas && (
          <Reveal>
            <p className="mt-10 border-l-2 border-primary/40 pl-4 text-[0.95rem] leading-relaxed text-ink-sub">
              主な配送エリアは、決まりしだいこのページに掲載します。担当エリアは面談時にご案内します。
            </p>
          </Reveal>
        )}

        {deliveryAreas && hasDeliveryAreas && (
          <>
            <Reveal>
              <h3 className="mt-16 text-xl font-black text-ink">主な配送エリア</h3>
            </Reveal>
            <div className={`mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 ${cityCols}`}>
              {deliveryAreas.map((d, i) => (
                <Reveal key={d.city} delay={i * 0.06}>
                  <div className="border-t-2 border-primary/70 pt-4">
                    <p className="text-lg font-black text-ink">{d.city}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${d.city}の配送エリアの例`}>
                      {d.towns.map((town) => (
                        <li
                          key={town}
                          className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-ink-sub"
                        >
                          {town}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-sub">
              ※町名は配送エリアの一例です。担当エリアは面談時にご案内します。
            </p>
          </>
        )}
      </div>
    </section>
  );
}
