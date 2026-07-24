import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { jobAreas } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
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
    ["代表者", siteConfig.representative],
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
        className="font-bold text-primary"
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
        className="font-bold text-primary"
      >
        {siteConfig.instagramHandle}
      </TrackedLink>,
    ],
  ];

  return (
    <>
      <Breadcrumbs items={[{ name: "会社情報", path: "/company" }]} />

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Company
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              会社情報
            </h1>
            <p className="mt-5 max-w-3xl leading-loose text-ink-sub">
              株式会社ウィラン（Willain）は、東京・千葉エリアでインターネット通販商品の宅配を中心とした軽貨物配送事業を展開しています。ドライバー一人ひとりが安心して稼働し、成長できる環境づくりを大切にしています。
            </p>
          </Reveal>
        </div>
      </div>

      {/* 会社概要テーブル */}
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow="Profile" title="会社概要" />
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full text-left text-sm md:text-base">
              <tbody className="divide-y divide-line">
                {rows.map(([label, value]) => (
                  <tr key={label as string} className="flex flex-col md:table-row">
                    <th
                      scope="row"
                      className="bg-mint/70 px-5 pt-3 pb-1 align-top font-bold whitespace-nowrap text-ink md:w-48 md:px-6 md:py-4"
                    >
                      {label}
                    </th>
                    <td className="px-5 pt-1 pb-3 leading-relaxed text-ink-sub md:px-6 md:py-4">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-sub">
            ※所在地の詳細・アクセス方法は、面談のご案内時にあらためてお伝えします。
          </p>
        </Reveal>
      </section>

      {/* 採用への考え方 */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading eyebrow="Message" title="採用について" />
          <Reveal>
            <div className="space-y-5 leading-loose text-ink-sub">
              <p>
                ウィランが採用で大切にしているのは、経験よりも「これから」です。宅配未経験の方、業務委託が初めての方でも、研修と日額保証のもとで着実に力をつけられる体制を用意しています。
              </p>
              <p>
                また、ドライバーの働き方はひとつではないと考えています。安定して長く稼ぎたい方、週3日から自分のペースで働きたい方、将来の独立を見据えて経験を積みたい方。それぞれの目標に合わせた稼働の仕方を、面談で一緒に設計します。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 募集エリア */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow="Recruit" title="現在募集中の求人" />
        <AreaCards areas={jobAreas} />
      </section>

      <CtaSection place="company" />
    </>
  );
}
