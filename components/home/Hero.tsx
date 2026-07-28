import Image from "next/image";
import { hasPublicFile } from "@/lib/assets";

/**
 * ヒーロー。1枚の写真を画面全面に敷き、左下にコピーを重ねる。
 * CTAボタンは置かない（ブランドイメージとメインコピーを主役にする）。
 * /public/images/hero-driver.webp を差し替えると自動反映。
 */
export function Hero() {
  const hasHeroImage = hasPublicFile("images/hero-driver.webp");

  return (
    <section className="relative -mt-16 h-[88svh] min-h-[560px] w-full overflow-hidden md:h-screen">
      {/* 背景写真（LCP：優先読み込み） */}
      {hasHeroImage ? (
        <Image
          src="/images/hero-driver.webp"
          alt="東京の街並みを背景に、白い軽バンの前に立つ軽貨物ドライバーのイメージ"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] md:object-[center_35%]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
      )}

      {/* オーバーレイ（PC：左→右／スマホ：下→上） */}
      <div className="hero-scrim absolute inset-0" />

      {/* コピー（左下寄せ） */}
      <div className="absolute inset-0 flex items-end pb-16 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-white/90 md:text-sm">
              軽貨物ドライバー募集中<span className="mx-2 text-white/40">｜</span>業務委託
            </p>

            <h1 className="h-hero mt-5 text-white">
              東京・千葉で、
              <br />
              自分らしく
              <span className="text-primary-light">稼ぐ</span>。
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
              品川・江東・葛西・船橋で軽貨物ドライバーを募集。
              <br className="hidden sm:block" />
              普通免許から始められる、新しい働き方。
            </p>

            {/* 条件は細い区切り線とテキストだけで表現（カード・ボタンにしない） */}
            <dl className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/25 pt-5 text-white">
              {[
                { t: "報酬", d: "日額20,000円〜" },
                { t: "経験", d: "未経験歓迎" },
                { t: "車両", d: "リースあり" },
              ].map((item, i) => (
                <div
                  key={item.d}
                  className={`flex items-baseline gap-2 ${i > 0 ? "border-white/25 sm:border-l sm:pl-6" : ""}`}
                >
                  <dt className="text-[0.65rem] font-medium tracking-wider text-white/60">
                    {item.t}
                  </dt>
                  <dd className="text-sm font-bold md:text-base">{item.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* スクロール誘導（控えめ） */}
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/40 p-1.5">
          <span className="h-1.5 w-1 animate-pulse rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
