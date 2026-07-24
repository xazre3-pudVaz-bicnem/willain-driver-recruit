import type { FaqItem } from "@/lib/faq";

/**
 * FAQアコーディオン。白背景・細い罫線区切り・＋/−アイコン。JS不要（details/summary）。
 * defaultOpenFirst で最初の1項目だけ開いた状態にできる。
 */
export function FaqAccordion({
  items,
  defaultOpenFirst = false,
}: {
  items: FaqItem[];
  defaultOpenFirst?: boolean;
}) {
  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <details
          key={item.q}
          open={defaultOpenFirst && i === 0}
          className="faq-item border-b border-line"
        >
          <summary className="flex items-start gap-4 py-5">
            <span className="mt-0.5 text-sm font-black text-primary">Q</span>
            <span className="flex-1 text-base font-bold leading-snug text-ink">
              {item.q}
            </span>
            {/* ＋/− アイコン */}
            <span
              aria-hidden="true"
              className="relative mt-1 h-4 w-4 shrink-0"
            >
              <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-primary" />
              <span className="faq-icon-bar-v absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-primary" />
            </span>
          </summary>
          <div className="pb-5 pl-8 text-[0.95rem] leading-relaxed text-ink-sub">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
