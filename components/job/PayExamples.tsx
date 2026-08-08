import { buildPayExamples, payExampleNote, jobCommon } from "@/lib/jobs";
import { Reveal } from "@/components/ui/Reveal";

/**
 * 月額報酬例。カードを使わず、横罫線で区切った数値表として表示する。
 * daily（日額）を渡すとそのエリアの例を表示。省略時はサイト下限（20,500円）。
 * 誤認防止のため必ず注記とセットで表示する。
 */
export function PayExamples({ daily }: { daily?: number }) {
  const rate = daily ?? jobCommon.payMinValue;
  const examples = buildPayExamples(rate);

  return (
    <div>
      <div className="border-t border-line">
        {examples.map((ex, i) => (
          <Reveal key={ex.days} delay={i * 0.08}>
            <div className="flex items-baseline justify-between gap-4 border-b border-line py-6 md:py-7">
              <span className="text-base font-bold text-ink md:text-xl">
                月{ex.days}日稼働
              </span>
              <span className="flex items-baseline gap-1 text-primary-dark">
                <span className="text-4xl font-black tracking-tight tabular-nums md:text-6xl">
                  {ex.amount.toLocaleString("ja-JP")}
                </span>
                <span className="text-base font-bold md:text-xl">円</span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-ink-sub md:text-sm">
        ※{payExampleNote(rate)}
      </p>
    </div>
  );
}
