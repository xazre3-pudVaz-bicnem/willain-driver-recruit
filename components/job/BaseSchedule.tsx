import type { JobArea } from "@/lib/jobs";
import { Reveal } from "@/components/ui/Reveal";

/**
 * 拠点の1日の流れ（時刻つきの実例）。DayFlow と同じ縦タイムラインで表現する。
 * 時刻はウィランに確認済みの拠点データ（lib/jobs.ts の schedule）だけを表示する。
 */
export function BaseSchedule({
  items,
}: {
  items: NonNullable<JobArea["schedule"]>;
}) {
  return (
    <div>
      <ol className="relative border-l border-line pl-6 md:pl-8">
        {items.map((item, i) => (
          <li key={item.title} className="relative pb-9 last:pb-0">
            <span className="absolute top-0 -left-[calc(1.5rem+1px)] flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary-dark text-[0.7rem] font-black text-white md:-left-[calc(2rem+1px)]">
              {i + 1}
            </span>
            <Reveal delay={Math.min(i * 0.05, 0.2)}>
              <p className="text-sm font-black tracking-wider text-primary-dark tabular-nums">
                {item.time}
              </p>
              <h3 className="mt-0.5 text-lg font-black text-ink md:text-xl">{item.title}</h3>
              <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-sub">
                {item.text}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
      <p className="mt-6 pl-6 text-xs text-ink-sub md:pl-8">
        ※配送個数・終了時刻は、荷物量や担当エリア・個人差によって変わります。
      </p>
    </div>
  );
}
