import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { hasPublicFile } from "@/lib/assets";
import { TrackedLink } from "@/components/ui/TrackedLink";

const badges = [
  "日額21,000円保証",
  "週払い対応（規定あり）",
  "未経験歓迎",
  "車両リースあり",
];

/**
 * ヒーローセクション。
 * /public/images/hero-driver.webp を追加すると自動でプレースホルダーから差し替わる。
 */
export function Hero() {
  const hasHeroImage = hasPublicFile("images/hero-driver.webp");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mint via-white to-white">
      {/* 背景の装飾（控えめに） */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-16 md:grid-cols-2 md:px-6 md:pt-20 md:pb-24">
        <div>
          <p className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold tracking-wider text-white">
            軽貨物ドライバー募集中｜業務委託
          </p>
          <h1 className="mt-6 text-4xl leading-[1.2] font-black tracking-tight text-ink md:text-5xl lg:text-[3.4rem]">
            東京・千葉で
            <span className="text-primary">稼ぐ</span>。<br />
            軽貨物ドライバー
            <br className="md:hidden" />
            募集。
          </h1>
          <p className="mt-5 text-lg font-bold text-ink md:text-xl">
            普通免許ひとつで、新しい働き方へ。
          </p>
          <p className="mt-2 leading-relaxed text-ink-sub">
            日額21,000円保証。未経験から始められる軽貨物配送。
            <br className="hidden md:inline" />
            品川・江東・葛西・船橋エリアで一緒に走る仲間を募集しています。
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="待遇のポイント">
            {badges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-primary/30 bg-white px-3.5 py-1.5 text-xs font-bold text-primary-dark shadow-sm"
              >
                {badge}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <TrackedLink
              href="/apply"
              event="apply_click"
              eventParams={{ place: "hero" }}
              className="rounded-full bg-primary px-8 py-4 text-center font-black text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-card-hover"
            >
              60秒で応募する
            </TrackedLink>
            <TrackedLink
              href={siteConfig.phoneLink}
              event="tel_click"
              eventParams={{ place: "hero" }}
              className="rounded-full border-2 border-primary bg-white px-8 py-4 text-center font-bold text-primary transition-colors hover:bg-mint"
              ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
            >
              電話で相談する
            </TrackedLink>
            <TrackedLink
              href={siteConfig.instagramUrl}
              event="instagram_click"
              eventParams={{ place: "hero" }}
              className="rounded-full px-6 py-4 text-center text-sm font-bold text-ink-sub underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Instagramを見る
            </TrackedLink>
          </div>
        </div>

        <div className="relative">
          {hasHeroImage ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card-hover md:aspect-[5/6]">
              <Image
                src="/images/hero-driver.webp"
                alt="白い軽バンの前に立つ株式会社ウィランの軽貨物ドライバー"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            /* 画像追加までの仮ビジュアル（/public/images/hero-driver.webp を置くと自動で差し替わる） */
            <div
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-mint shadow-card-hover md:aspect-[5/6]"
              role="img"
              aria-label="軽バンで配送する軽貨物ドライバーのイメージ"
            >
              <VanIllustration />
            </div>
          )}
          {/* 実績風の装飾は置かず、事実ラベルのみ */}
          <div className="absolute -bottom-4 left-4 rounded-2xl border border-line bg-white px-5 py-3 shadow-card md:left-8">
            <p className="text-xs font-bold text-ink-sub">報酬</p>
            <p className="text-lg font-black text-primary tabular-nums">
              日額21,000円<span className="text-xs font-bold">以上</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 仮ビジュアル用の軽バンイラスト（装飾） */
function VanIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 320"
      className="h-3/5 w-3/5 opacity-90"
      fill="none"
    >
      <circle cx="160" cy="160" r="140" fill="white" fillOpacity="0.15" />
      <rect x="40" y="130" width="180" height="90" rx="10" fill="white" />
      <path
        d="M220 145h34a10 10 0 0 1 8 4l16 22a10 10 0 0 1 2 6v33a10 10 0 0 1-10 10h-50v-75Z"
        fill="white"
      />
      <rect x="232" y="155" width="30" height="24" rx="4" fill="#11AAA5" />
      <rect x="54" y="146" width="60" height="10" rx="5" fill="#EAF9F8" />
      <rect x="54" y="164" width="90" height="10" rx="5" fill="#EAF9F8" />
      <circle cx="90" cy="225" r="22" fill="#111827" />
      <circle cx="90" cy="225" r="10" fill="#D5E9E7" />
      <circle cx="240" cy="225" r="22" fill="#111827" />
      <circle cx="240" cy="225" r="10" fill="#D5E9E7" />
      <path
        d="M40 205h240"
        stroke="#006E6B"
        strokeOpacity="0.2"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
