import { Reveal } from "@/components/ui/Reveal";

type Props = {
  /** 使用しない（後方互換のため受け取るが描画しない）。英語ラベルはサイト全体で最小化する。 */
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
};

/**
 * セクション見出し。日本語見出しを主役に、左揃え・大きめの力強いタイポグラフィ。
 * 英語ラベル（eyebrow）はサイト全体で最小化する方針のため描画しない。
 */
export function SectionHeading({
  title,
  lead,
  align = "left",
  as: Tag = "h2",
}: Props) {
  return (
    <Reveal
      className={`mb-8 md:mb-12 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <Tag className="h-section text-ink">{title}</Tag>
      {lead && (
        <p
          className={`mt-5 text-[1.0625rem] leading-[1.9] text-ink-sub ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
