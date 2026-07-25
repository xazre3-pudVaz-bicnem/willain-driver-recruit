import { Reveal } from "@/components/ui/Reveal";

/**
 * セクションの小見出し（任意の番号＋日本語ラベル＋細線）。
 * 英語ラベルは使わず、番号と日本語で編集的に見せる。
 */
export function Kicker({
  n,
  children,
  light = false,
  animate = false,
}: {
  n?: string;
  children: React.ReactNode;
  light?: boolean;
  animate?: boolean;
}) {
  const inner = (
    <div className="mb-5 flex items-center gap-3">
      {n && (
        <span
          className={`text-sm font-black tabular-nums ${light ? "text-primary-light" : "text-primary"}`}
        >
          {n}
        </span>
      )}
      <span className={`h-px w-8 ${light ? "bg-white/30" : "bg-primary/40"}`} />
      <span
        className={`text-xs font-bold tracking-wider ${light ? "text-white/70" : "text-ink-sub"}`}
      >
        {children}
      </span>
    </div>
  );
  return animate ? <Reveal>{inner}</Reveal> : inner;
}
