import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { jobAreas } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
import { PageHero } from "@/components/ui/PageHero";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { AreaCards } from "@/components/job/AreaCards";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "会社情報",
  description:
    "株式会社ウィラン（Willain）の会社情報です。東京・千葉エリアで軽貨物配送事業を展開し、品川区・江東区・江戸川区葛西・船橋市で業務委託の軽貨物ドライバーを募集しています。",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "会社情報｜株式会社ウィラン",
    description:
      "東京・千葉で軽貨物配送事業を展開する株式会社ウィランの会社情報です。",
    url: "/company",
    type: "website",
  },
};

export default function CompanyPage() {
  /*
   * 【公開前確認事項】
   * 本社所在地・営業拠点所在地は株式会社ウィランへ最終確認すること。
   * 表示内容は lib/site-config.ts で一元管理している。
   */
  const rows: [string, React.ReactNode][] = [
    ["会社名", siteConfig.companyName],
    ["英語・ブランド表記", siteConfig.brandName],
    [
      "本社所在地",
      <>
        {siteConfig.address.postalCode}
        <br />
        {siteConfig.address.full}
      </>,
    ],
    [
      "電話番号",
      <TrackedLink
        key="tel"
        href={siteConfig.phoneLink}
        event="tel_click"
        eventParams={{ place: "company" }}
        className="font-bold text-primary-dark"
      >
        {siteConfig.phoneDisplay}
      </TrackedLink>,
    ],
    ["事業内容", siteConfig.business],
    [
      "採用エリア",
      "東京都品川区・江東区・江戸川区（葛西エリア）、千葉県船橋市",
    ],
    [
      "公式Instagram",
      <TrackedLink
        key="instagram"
        href={siteConfig.instagramUrl}
        event="instagram_click"
        eventParams={{ place: "company" }}
        className="font-bold text-primary-dark"
      >
        {siteConfig.instagramHandle}
      </TrackedLink>,
    ],
  ];

  return (
    <>
      <Breadcrumbs items={[{ name: "会社情報", path: "/company" }]} />

      <PageHero
        kicker="会社情報"
        title="東京・千葉の軽貨物配送。"
        lead="株式会社ウィラン（Willain）は、東京・千葉エリアでインターネット通販商品の宅配を中心とした軽貨物配送事業を展開しています。ドライバー一人ひとりが安定して稼働し、成長できる環境づくりを大切にしています。"
      />

      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-16">
        <Reveal>
          <Photo
            src="/images/photos/fleet.webp"
            alt="株式会社ウィランの軽貨物配送車両"
            aspect="aspect-[16/7]"
            rounded="rounded-sm"
            sizes="(max-width: 1152px) 100vw, 1152px"
            priority
          />
        </Reveal>
      </section>

      {/* 会社概要テーブル */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Kicker animate>会社概要</Kicker>
        <Reveal>
          <h2 className="h-section mb-8 text-ink">株式会社ウィラン。</h2>
        </Reveal>
        <Reveal>
          <dl className="border-t border-line">
            {rows.map(([label, value]) => (
              <div
                key={label as string}
                className="flex flex-col gap-1 border-b border-line py-4 md:flex-row md:gap-8"
              >
                <dt className="w-40 shrink-0 text-sm font-bold text-ink-sub">
                  {label}
                </dt>
                <dd className="leading-relaxed text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-ink-sub">
            ※所在地の詳細・アクセス方法は、面談のご案内時にあらためてお伝えします。
          </p>
        </Reveal>
      </section>

      {/* 採用への考え方 */}
      <section className="bg-emerald-ink">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <Kicker light animate>
            採用について
          </Kicker>
          <Reveal>
            <h2 className="h-section text-white">経験より、これから。</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-5 text-base leading-[1.9] text-white/75">
              <p>
                ウィランが採用で見ているのは、経験よりも「これから」です。宅配未経験の方、業務委託が初めての方でも、研修と日額保証のもとで着実に力をつけられます。
              </p>
              <p>
                働き方はひとつではありません。安定して長く稼ぎたい方、週3日から自分のペースで働きたい方、将来の独立を見据えて経験を積みたい方。それぞれの目標に合わせた稼働の仕方を、面談で一緒に設計します。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 募集エリア */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>現在募集中の求人</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">エリアから探す。</h2>
          </Reveal>
          <AreaCards areas={jobAreas} />
        </div>
      </section>

      <CtaSection place="company" />
    </>
  );
}
