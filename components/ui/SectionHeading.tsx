import { Reveal } from "@/components/ui/Reveal";

type Props = {
  /** 英字の小見出しラベル */
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  as: Tag = "h2",
}: Props) {
  return (
    <Reveal
      className={`mb-10 md:mb-14 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow && (
        <p
          className="mb-3 text-xs font-bold tracking-[0.25em] text-primary uppercase"
          aria-hidden="true"
        >
          {eyebrow}
        </p>
      )}
      <Tag className="text-[1.75rem] leading-snug font-black tracking-tight text-ink md:text-4xl">
        {title}
      </Tag>
      {lead && (
        <p
          className={`mt-4 leading-relaxed text-ink-sub ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
