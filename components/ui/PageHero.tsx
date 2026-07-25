import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/Kicker";

/**
 * サブページ共通のヒーロー見出し。白背景・左揃え・大きな日本語H1。
 * トップページの編集的トーンに合わせる（淡水色グラデーションは使わない）。
 */
export function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <Reveal>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal>
          <h1 className="h-section text-ink">{title}</h1>
        </Reveal>
        {lead && (
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-3xl text-[1.0625rem] leading-[1.9] text-ink-sub">
              {lead}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
