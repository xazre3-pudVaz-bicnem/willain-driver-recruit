import { siteConfig } from "@/lib/site-config";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Reveal } from "@/components/ui/Reveal";

/**
 * ページ下部の応募CTAセクション（全ページ共通で再利用）。
 */
export function CtaSection({
  title = "まずは話を聞くだけでもOKです",
  text = "「自分に向いているか分からない」という段階でのご相談も歓迎です。応募フォームは60秒で入力できます。",
  place,
}: {
  title?: string;
  text?: string;
  place: string;
}) {
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
        <Reveal>
          <h2 className="text-2xl leading-snug font-black text-white md:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/90">
            {text}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedLink
              href="/apply"
              event="apply_click"
              eventParams={{ place }}
              className="w-full rounded-full bg-white px-8 py-4 text-center font-black text-primary-dark shadow-card transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              60秒で応募する
            </TrackedLink>
            <TrackedLink
              href={siteConfig.phoneLink}
              event="tel_click"
              eventParams={{ place }}
              className="w-full rounded-full border-2 border-white/80 px-8 py-4 text-center font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
            >
              電話で相談する {siteConfig.phoneDisplay}
            </TrackedLink>
          </div>
          <p className="mt-4 text-xs text-white/70">
            受付時間外・配送中は折り返しのご連絡になる場合があります。
          </p>
        </Reveal>
      </div>
    </section>
  );
}
