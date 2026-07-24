import { jobCommon } from "@/lib/jobs";
import { Reveal } from "@/components/ui/Reveal";

/** 月額報酬例。誤認防止のため必ず注記とセットで表示する */
export function PayExamples() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {jobCommon.payExamples.map((ex, i) => (
          <Reveal key={ex.days} delay={i * 0.1}>
            <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-card">
              <p className="text-sm font-bold text-ink-sub">
                月{ex.days}日稼働の場合
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-primary tabular-nums">
                {ex.amount.toLocaleString("ja-JP")}
                <span className="ml-1 text-base font-bold">円</span>
              </p>
              <p className="mt-1 text-xs text-ink-sub">月額報酬例</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-5 rounded-xl bg-mint px-5 py-4 text-xs leading-relaxed text-ink-sub md:text-sm">
        ※{jobCommon.payExampleNote}
      </p>
    </div>
  );
}
