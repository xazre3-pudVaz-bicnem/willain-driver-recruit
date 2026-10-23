import type { JobArea } from "@/lib/jobs";
import { Reveal } from "@/components/ui/Reveal";

/**
 * ドライバーの声。本人に確認済みの実際の声（lib/jobs.ts の voices）を引用として表示する。
 * 架空の氏名・年齢・顔写真は付けない。大変な点も含めてそのまま載せる。
 */
export function DriverVoices({ voices }: { voices: NonNullable<JobArea["voices"]> }) {
  return (
    <div className="space-y-12">
      {voices.map((voice) => (
        <Reveal key={voice.label}>
          <figure className="border-l-4 border-primary/60 pl-6 md:pl-8">
            <blockquote className="space-y-4 text-[1.02rem] leading-loose text-ink">
              {voice.paragraphs.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </blockquote>
            <figcaption className="mt-5 text-sm font-bold text-ink-sub">— {voice.label}</figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
