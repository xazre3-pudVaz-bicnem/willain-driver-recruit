import { dayFlow } from "@/lib/jobs";
import { Reveal } from "@/components/ui/Reveal";

/**
 * 1日の流れ。具体的な時刻は案件により異なるため表示しない。
 */
export function DayFlow() {
  return (
    <div>
      <ol className="relative space-y-0">
        {dayFlow.map((item, i) => (
          <li key={item.step} className="relative flex gap-5 pb-8 last:pb-0">
            {/* 縦ライン */}
            {i < dayFlow.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-10 left-[19px] h-full w-0.5 bg-line"
              />
            )}
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
              {i + 1}
            </span>
            <Reveal className="flex-1 pt-1" delay={Math.min(i * 0.05, 0.3)}>
              <h3 className="font-black text-ink">{item.step}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-sub">
                {item.text}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-ink-sub">
        ※時間配分は担当エリア・案件・時期によって異なります。詳細は面談時にご案内します。
      </p>
    </div>
  );
}
