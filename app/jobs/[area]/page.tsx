import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { jobAreas, getJobArea, jobCommon } from "@/lib/jobs";
import { jobPostingJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JobConditionsTable } from "@/components/job/JobConditionsTable";
import { PayExamples } from "@/components/job/PayExamples";
import { DayFlow } from "@/components/job/DayFlow";
import { ApplyFlow } from "@/components/job/ApplyFlow";
import { AreaCards } from "@/components/job/AreaCards";
import { CtaSection } from "@/components/job/CtaSection";

type Props = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return jobAreas.map((area) => ({ area: area.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area: slug } = await params;
  const area = getJobArea(slug);
  if (!area) return {};
  return {
    title: area.metaTitle,
    description: area.metaDescription,
    alternates: { canonical: `/jobs/${area.slug}` },
    openGraph: {
      title: `${area.metaTitle}｜株式会社ウィラン`,
      description: area.metaDescription,
      url: `/jobs/${area.slug}`,
      type: "website",
    },
  };
}

/**
 * エリア別求人詳細ページ。
 * JobPosting構造化データはこのページにのみ実装する（Googleしごと検索対応）。
 * 画面表示とJSON-LDは同じ lib/jobs.ts のデータから生成されるため内容が一致する。
 */
export default async function JobAreaPage({ params }: Props) {
  const { area: slug } = await params;
  const area = getJobArea(slug);
  if (!area) notFound();

  return (
    <>
      <JsonLd data={jobPostingJsonLd(area)} />
      <JsonLd data={faqJsonLd(area.areaFaq)} />
      <Breadcrumbs
        items={[
          { name: "求人一覧", path: "/jobs" },
          { name: `${area.areaName}の求人`, path: `/jobs/${area.slug}` },
        ]}
      />

      {/* 求人ヘッダー */}
      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold tracking-wider text-white">
              募集中｜業務委託
            </p>
            <h1 className="mt-5 text-3xl leading-tight font-black text-ink md:text-4xl">
              {area.h1}
            </h1>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="待遇のポイント">
              {[
                "日額21,000円保証",
                "週払い可（規定あり）",
                "未経験歓迎",
                "車両リース月額25,000円〜",
                "週3日から相談可",
              ].map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-primary/30 bg-white px-3.5 py-1.5 text-xs font-bold text-primary-dark"
                >
                  {badge}
                </li>
              ))}
            </ul>
            <div className="mt-7 space-y-4 leading-loose text-ink-sub">
              {area.lead.map((paragraph) => (
                <p key={paragraph.slice(0, 20)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* エリアの特徴 */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Feature"
          title={`${area.addressLocality}エリアで働く特徴`}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {area.features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.1} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-card">
                <span className="text-3xl font-black text-primary/20 tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="mt-2 text-lg leading-snug font-black text-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                  {feature.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 募集要項（画面表示＝構造化データ） */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <SectionHeading eyebrow="Conditions" title="募集要項" />
          <Reveal>
            <JobConditionsTable areaName={area.areaName} />
          </Reveal>
          <p className="mt-5 rounded-xl border border-line bg-white px-5 py-4 text-sm leading-relaxed text-ink-sub">
            {jobCommon.meetingNote}
            配送センターの所在地や担当エリアの詳細は、応募後の面談で確認できます。
          </p>
        </div>
      </section>

      {/* 報酬例 */}
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Simulation"
          title="月額報酬例"
          lead="日額21,000円×稼働日数のシンプルな計算例です。"
        />
        <PayExamples />
      </section>

      {/* 1日の流れ */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading eyebrow="Schedule" title="1日の流れ" />
          <DayFlow />
        </div>
      </section>

      {/* 車両・研修 */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow="Vehicle & Training" title="車両と研修について" />
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-card">
              <h3 className="text-lg font-black text-ink">車両について</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-sub">
                <li>・車両リース制度あり（月額25,000円〜）</li>
                <li>・ご自身の軽バンの持ち込みも可能</li>
                <li>・黒ナンバー（事業用登録）の手続きは面談時にご案内</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-card">
              <h3 className="text-lg font-black text-ink">研修について</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-sub">
                <li>・先輩ドライバーに同乗する横乗り研修</li>
                <li>・未経験者向け研修で配送の基礎から習得</li>
                <li>・稼働開始後も日額21,000円保証で収入面をサポート</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 応募の流れ */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading eyebrow="Flow" title="応募の流れ" />
          <ApplyFlow />
        </div>
      </section>

      {/* 地域別FAQ（FAQPage構造化データ付き） */}
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="FAQ"
          title={`${area.addressLocality}の求人に関するよくある質問`}
        />
        <FaqAccordion items={area.areaFaq} />
        <Reveal className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
          >
            その他のよくある質問を見る
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Reveal>
      </section>

      {/* 応募CTA */}
      <CtaSection
        title={`${area.areaName}の軽貨物ドライバーに応募する`}
        text="応募フォームは60秒で入力できます。「まず条件だけ聞きたい」というご相談も歓迎です。"
        place={`job_${area.slug}`}
      />

      {/* 他エリアへの内部リンク */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Other Areas"
          title="他のエリアの求人を見る"
        />
        <AreaCards areas={jobAreas} currentSlug={area.slug} />
        <Reveal className="mt-8 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
          >
            求人一覧へ戻る
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
