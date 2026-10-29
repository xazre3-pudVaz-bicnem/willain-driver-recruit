import { baseLocationLabel, type JobArea } from "@/lib/jobs";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/Kicker";
import { TrackedLink } from "@/components/ui/TrackedLink";

/**
 * 自転車での配送スタッフの募集（lib/jobs.ts の bicycleStaff がある拠点のみ）。
 * 軽貨物ドライバーとは別の募集のため、募集要項テーブル・JobPosting には含めず、この欄だけで案内する。
 * 書くのはウィランに確認済みの条件だけ。それ以外の条件は面談で説明する。
 */
export function BicycleStaff({ area }: { area: JobArea }) {
  const bike = area.bicycleStaff;
  if (!bike) return null;
  const applySlug = `${area.slug}-bicycle`;
  const rows = [
    { t: "報酬", d: bike.dailyPayLabel },
    { t: "運転免許", d: bike.license },
    { t: "自転車", d: bike.bike },
    { t: "勤務時間", d: bike.workHours },
    ...(area.base ? [{ t: "集合場所", d: baseLocationLabel(area.base) }] : []),
  ];

  return (
    <section id="bicycle" className="scroll-mt-24 border-t border-line bg-mint/40">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Kicker animate>自転車での配送スタッフ</Kicker>
        <Reveal>
          <h2 className="h-section mb-4 text-ink">
            免許がなくても、
            <br className="sm:hidden" />
            自転車で。
          </h2>
        </Reveal>
        <Reveal>
          <p className="mb-8 max-w-2xl leading-relaxed text-ink-sub">
            {`${area.base?.name ?? area.shortName}では、軽バンのドライバーに加えて、自転車で荷物を届ける配送スタッフも募集しています。`}
          </p>
        </Reveal>
        <Reveal>
          <dl className="divide-y divide-line overflow-hidden rounded-md border border-line bg-white">
            {rows.map((row) => (
              <div
                key={row.t}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6 md:px-6"
              >
                <dt className="shrink-0 font-bold text-ink sm:w-24">{row.t}</dt>
                <dd className="leading-relaxed text-ink-sub">{row.d}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <p className="mt-5 border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-ink-sub">
          ここに書いていない条件（契約形態・勤務日数など）は、面談時にご説明します。
        </p>
        <Reveal className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href={`/apply?area=${applySlug}`}
              event="apply_click"
              eventParams={{ place: `job_${applySlug}`, job_area: applySlug }}
              className="rounded-md bg-primary-dark px-8 py-4 text-center font-black text-white transition-opacity hover:opacity-90"
            >
              自転車での配送スタッフに応募する
            </TrackedLink>
            <TrackedLink
              href={siteConfig.phoneLink}
              event="tel_click"
              eventParams={{ place: `job_${applySlug}` }}
              className="rounded-md border border-primary-dark/40 bg-white px-8 py-4 text-center font-bold text-primary-dark transition-colors hover:border-primary-dark"
              ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
            >
              電話で相談する（{siteConfig.phoneDisplay}）
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
