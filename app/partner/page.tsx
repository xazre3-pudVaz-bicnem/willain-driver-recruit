import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { faqJsonLd, webPageJsonLd } from "@/lib/jsonld";
import {
  partnerSeo,
  partnerHeroImage,
  partnerPageUpdatedAt,
  partnerStats,
  partnerStatsAsOf,
  partnerActiveBases,
  partnerPlannedBases,
  partnerTypes,
  partnerConditions,
  partnerRequirements,
  partnerSupports,
  partnerFlow,
  partnerFlowNote,
  partnerFaq,
} from "@/lib/partner";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { PartnerForm } from "@/components/forms/PartnerForm";

export const metadata: Metadata = {
  title: partnerSeo.title,
  description: partnerSeo.description,
  keywords: partnerSeo.keywords,
  alternates: { canonical: "/partner" },
  openGraph: {
    title: partnerSeo.ogTitle,
    description: partnerSeo.ogDescription,
    url: "/partner",
    siteName: siteConfig.siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: partnerSeo.ogTitle,
    description: partnerSeo.ogDescription,
  },
};

function Arrow() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 協力会社・パートナー・フランチャイズ募集ページ（法人・個人事業主向け）。
 * 掲載内容と構造化データ（FAQPage）は lib/partner.ts の同じデータから生成する。
 * 求人ではないため JobPosting は付けない。
 */
export default function PartnerPage() {
  const stats = Object.values(partnerStats);

  return (
    <>
      <JsonLd data={faqJsonLd(partnerFaq)} />
      <JsonLd
        data={webPageJsonLd({
          title: partnerSeo.h1,
          path: "/partner",
          image: partnerHeroImage.src,
          dateModified: partnerPageUpdatedAt,
        })}
      />
      <Breadcrumbs items={[{ name: "協力会社・パートナー募集", path: "/partner" }]} />

      {/* ヒーロー：テキストと写真の左右分割 */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:gap-14 md:py-20">
          <div>
            <Reveal>
              <Kicker>協力会社・パートナー・フランチャイズ募集</Kicker>
            </Reveal>
            <Reveal>
              <h1 className="text-3xl leading-tight font-black text-ink md:text-5xl md:leading-[1.15]">
                {partnerSeo.h1Phrases.map((phrase) => (
                  <span key={phrase} className="inline-block">
                    {phrase}
                  </span>
                ))}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-xl leading-snug font-black text-primary-dark md:text-2xl">
                全国への拡大に向けて、一緒に伸ばしていける仲間を探しています。
              </p>
              <p className="mt-5 text-[1.0625rem] leading-[1.9] text-ink-sub">
                {`株式会社ウィランは、主にAmazon関連の個人宅配送を行う軽貨物配送の会社です。現在${partnerActiveBases}の${partnerStats.bases.value}${partnerStats.bases.unit}で稼働しており、${partnerPlannedBases}への開設、さらに全国への拡大を予定しています。案件のご紹介から、車両・黒ナンバーの手続き、研修、事務まで、ウィランがサポートします。`}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="rounded-md bg-primary-dark px-7 py-4 text-center font-black text-white transition-opacity hover:opacity-90"
                >
                  フォームで問い合わせる
                </a>
                <TrackedLink
                  href={siteConfig.phoneLink}
                  event="tel_click"
                  eventParams={{ place: "partner_hero" }}
                  className="rounded-md border border-primary-dark px-7 py-4 text-center font-bold text-primary-dark transition-colors hover:bg-mint"
                  ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
                >
                  電話で相談する（{siteConfig.phoneDisplay}）
                </TrackedLink>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Photo
              src={partnerHeroImage.src}
              alt={partnerHeroImage.alt}
              aspect="aspect-[4/3]"
              rounded="rounded-sm"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* 実績：罫線区切りの数字 */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <Kicker animate>ウィランの実績</Kicker>
          <Reveal>
            <dl className="grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((s) => (
                <div key={s.label} className="py-6 sm:px-8 sm:first:pl-0">
                  <dt className="text-xs font-bold tracking-wider text-ink-sub">
                    {s.label}
                  </dt>
                  <dd className="mt-2 flex items-baseline gap-1">
                    <span className="text-5xl font-black tabular-nums text-primary-dark md:text-6xl">
                      {s.value}
                    </span>
                    <span className="text-lg font-black text-primary-dark">
                      {s.unit}
                    </span>
                  </dd>
                  {"note" in s && (
                    <dd className="mt-1 text-sm text-ink-sub">{s.note}</dd>
                  )}
                </div>
              ))}
            </dl>
          </Reveal>
          <p className="mt-4 text-xs text-ink-sub">※{partnerStatsAsOf}の数字です。</p>
        </div>
      </section>

      {/* 募集区分：罫線区切りの番号付き3列（カードなし） */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>募集している3つの区分</Kicker>
          <Reveal>
            <h2 className="h-section mb-4 text-ink">関わり方は、3つ。</h2>
          </Reveal>
          <Reveal>
            <p className="mb-10 max-w-2xl text-[0.95rem] leading-relaxed text-ink-sub">
              法人さま、個人事業主の方、フランチャイズでの事業をお考えの方を募集しています。どの区分が合うか迷う場合も、お気軽にご相談ください。
            </p>
          </Reveal>
          <div className="grid gap-x-10 md:grid-cols-3">
            {partnerTypes.map((type, i) => (
              <Reveal key={type.slug} delay={i * 0.08}>
                <div className="flex h-full flex-col border-t-2 border-primary/70 py-6">
                  <span className="text-3xl font-black tabular-nums text-primary-dark/25">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-xl leading-snug font-black text-ink">
                    {type.label}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-primary-dark">
                    対象：{type.target}
                  </p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">
                    {type.summary}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[0.95rem] leading-relaxed text-ink-sub">
                    {type.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5">
                    <Link
                      href={`/partner?type=${type.slug}#contact`}
                      className="inline-flex items-center gap-1 font-bold text-primary-dark underline-offset-4 hover:underline"
                    >
                      {type.label}について問い合わせる
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 案件と報酬：条件の罫線リスト＋写真 */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_1fr] md:gap-14 md:py-24">
          <div>
            <Kicker animate>案件と報酬</Kicker>
            <Reveal>
              <h2 className="h-section mb-8 text-ink">案件と、報酬の決め方。</h2>
            </Reveal>
            <Reveal>
              <dl className="border-t border-line">
                {partnerConditions.map((row) => (
                  <div
                    key={row.th}
                    className="flex flex-col gap-1 border-b border-line py-4 md:flex-row md:gap-8"
                  >
                    <dt className="w-32 shrink-0 text-sm font-bold text-ink-sub">
                      {row.th}
                    </dt>
                    <dd className="leading-relaxed text-ink">{row.td}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="md:pt-24">
            <Photo
              src="/images/photos/fleet.webp"
              alt="並んだ配送用軽バンのイメージ"
              aspect="aspect-[4/3]"
              rounded="rounded-sm"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </Reveal>
        </div>
      </section>

      {/* 参加条件：罫線区切りの番号付きリスト */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>参加条件</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">普通免許があれば、始められます。</h2>
          </Reveal>
          <div className="grid gap-x-14 md:grid-cols-3">
            {partnerRequirements.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="border-t-2 border-primary/70 py-6">
                  <span className="text-3xl font-black tabular-nums text-primary-dark/25">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-lg leading-snug font-black text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-sub">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* サポート内容：濃色背景・半透明罫線 */}
      <section className="bg-emerald-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-24">
          <div>
            <Reveal>
              <Kicker light>ウィランのサポート</Kicker>
            </Reveal>
            <Reveal>
              <h2 className="h-section text-white">
                立ち上げから、
                <br />
                稼働したあとまで。
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-base leading-[1.9] text-white/70">
                サポートの内容や条件は、面接時にくわしくご説明します。
              </p>
            </Reveal>
          </div>
          <div className="border-t border-white/15">
            {partnerSupports.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.06, 0.2)}>
                <div className="flex gap-5 border-b border-white/15 py-5">
                  <span className="text-sm font-black tabular-nums text-primary-light">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-black text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 契約までの流れ：横罫線タイムライン */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Kicker animate>ご契約までの流れ</Kicker>
        <Reveal>
          <h2 className="h-section mb-10 text-ink">3ステップで、ご契約。</h2>
        </Reveal>
        <ol className="border-t border-line">
          {partnerFlow.map((item, i) => (
            <li key={item.step} className="border-b border-line">
              <Reveal delay={i * 0.08}>
                <div className="grid grid-cols-[auto_1fr] gap-x-5 py-6 md:grid-cols-[7rem_1fr] md:gap-x-8 md:py-7">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[0.6rem] font-black tracking-widest text-primary-dark">
                      STEP
                    </span>
                    <span className="text-3xl font-black tabular-nums text-primary-dark md:text-4xl">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-black text-ink md:text-xl">
                      {item.step}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-sub">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal>
          <p className="mt-6 border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-ink-sub">
            {partnerFlowNote}
          </p>
        </Reveal>
      </section>

      {/* よくある質問（FAQPage構造化データ付き） */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <Kicker animate>よくある質問</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">気になる点を、先に確認。</h2>
          </Reveal>
          <FaqAccordion items={partnerFaq} defaultOpenFirst />
        </div>
      </section>

      {/* お問い合わせフォーム（?type= で募集区分を初期選択） */}
      <section id="contact" className="scroll-mt-20 border-t border-line bg-paper">
        <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
          <Kicker animate>お問い合わせ</Kicker>
          <Reveal>
            <h2 className="h-section text-ink">まずは、ご相談ください。</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[1.0625rem] leading-[1.9] text-ink-sub">
              「条件だけ聞いてみたい」という段階でもかまいません。内容を確認のうえ、担当者からご連絡します。
            </p>
          </Reveal>

          <div className="mt-10 rounded-lg border border-line bg-white p-6 md:p-10">
            <Suspense fallback={null}>
              <PartnerForm />
            </Suspense>
          </div>

          <div className="mt-8 rounded-md border border-line bg-white px-6 py-5 text-center">
            <p className="text-sm font-bold text-ink">お電話でのご相談はこちら</p>
            <TrackedLink
              href={siteConfig.phoneLink}
              event="tel_click"
              eventParams={{ place: "partner_contact" }}
              className="mt-1 inline-block text-2xl font-black text-primary-dark tabular-nums"
              ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
            >
              {siteConfig.phoneDisplay}
            </TrackedLink>
            <p className="mt-1 text-xs text-ink-sub">{siteConfig.phoneNote}</p>
          </div>

          <p className="mt-6 text-center text-sm leading-relaxed text-ink-sub">
            ドライバー（業務委託）として働きたい方は、
            <Link
              href="/jobs"
              className="font-bold text-primary-dark underline underline-offset-4"
            >
              軽貨物ドライバー求人一覧
            </Link>
            からご応募ください。
          </p>
        </div>
      </section>
    </>
  );
}
