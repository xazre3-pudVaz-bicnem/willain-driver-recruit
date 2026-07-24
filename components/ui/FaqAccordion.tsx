import type { FaqItem } from "@/lib/faq";

/**
 * FAQアコーディオン。details/summaryのみで動作するためJS不要。
 * 回答は最初の1〜2文で結論を述べる形式（AIO対応）。
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="faq-item group rounded-xl border border-line bg-white shadow-card"
        >
          <summary className="flex items-center gap-3 px-5 py-4 font-bold text-ink">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-black text-primary"
            >
              Q
            </span>
            <span className="flex-1 leading-snug">{item.q}</span>
            <svg
              aria-hidden="true"
              className="faq-icon h-4 w-4 shrink-0 text-primary"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 2v12M2 8h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </summary>
          <div className="border-t border-line px-5 py-4 pl-14 leading-relaxed text-ink-sub">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
