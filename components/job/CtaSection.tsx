import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Reveal } from "@/components/ui/Reveal";

/**
 * ページ下部の応募CTA。白カードは使わず、走行写真の全面背景＋濃色オーバーレイ。
 */
export function CtaSection({
  title = "まずは、希望の働き方を聞かせてください。",
  text = "品川・江東・葛西・船橋で募集中。面談時に担当エリアや稼働条件をご案内します。",
  place,
}: {
  title?: string;
  text?: string;
  place: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/photos/cta-drive.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-emerald-ink/85" />
      <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
        <Reveal>
          <h2 className="h-section max-w-3xl text-white">{title}</h2>
          <p className="mt-6 max-w-2xl text-base leading-[1.9] text-white/85 md:text-lg">
            {text}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href="/apply"
              event="apply_click"
              eventParams={{ place }}
              className="rounded-md bg-white px-8 py-4 text-center font-black text-primary-dark transition-colors hover:bg-mint"
            >
              WEBから応募する
            </TrackedLink>
            <TrackedLink
              href={siteConfig.phoneLink}
              event="tel_click"
              eventParams={{ place }}
              className="rounded-md border border-white/50 px-8 py-4 text-center font-bold text-white transition-colors hover:bg-white/10"
              ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
            >
              電話で相談する（{siteConfig.phoneDisplay}）
            </TrackedLink>
          </div>
          <p className="mt-5 text-xs text-white/60">
            受付時間外・配送中は折り返しのご連絡になる場合があります。
          </p>
        </Reveal>
      </div>
    </section>
  );
}
