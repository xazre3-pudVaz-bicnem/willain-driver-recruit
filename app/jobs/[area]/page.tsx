import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { jobAreas, getJobArea, jobCommon } from "@/lib/jobs";
import { jobPostingJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
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
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <Reveal>
            <p className="inline-block rounded-full bg-primary-dark px-4 py-1.5 text-xs font-bold tracking-wider text-white">
              募集中｜業務委託
            </p>
            <h1 className="mt-5 text-3xl leading-tight font-black text-ink md:text-4xl">
              {area.h1}
            </h1>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="待遇のポイント">
              {[
                area.dailyPayLabel,
                "週払い可（規定あり）",
                "未経験歓迎",
                "車両リース月額30,000円",
                "最短5日で稼働可",
              ].map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-primary/30 bg-white px-3.5 py-1.5 text-xs font-bold text-primary-dark"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Photo
              src={area.image}
              alt={area.imageAlt}
              aspect="aspect-[16/9]"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </Reveal>
          <Reveal className="mt-8">
            <div className="space-y-4 leading-loose text-ink-sub">
              {area.lead.map((paragraph) => (
                <p key={paragraph.slice(0, 20)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* エリアの特徴：罫線区切りの番号付きリスト（カードなし） */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>{`${area.addressLocality}で働く`}</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">このエリアの特徴。</h2>
          </Reveal>
          <div className="grid gap-x-14 md:grid-cols-3">
            {area.features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.08}>
                <div className="border-t-2 border-primary/70 py-6">
                  <span className="text-3xl font-black tabular-nums text-primary-dark/25">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-lg leading-snug font-black text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-sub">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 募集要項（画面表示＝構造化データ） */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Kicker animate>募集要項</Kicker>
          <Reveal>
            <h2 className="h-section mb-8 text-ink">条件をまとめて確認。</h2>
          </Reveal>
          <Reveal>
            <JobConditionsTable
              areaName={area.areaName}
              payLabel={area.dailyPayLabel}
              paySupplement={`${area.areaName}の日額保証（規定あり）・週払い可能（規定あり）`}
            />
          </Reveal>
          <p className="mt-5 border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-ink-sub">
            {jobCommon.meetingNote}
            配送センターの所在地や担当エリアの詳細は、応募後の面談で確認できます。
          </p>
        </div>
      </section>

      {/* 報酬例 */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Kicker animate>月額の報酬例</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">日額×稼働日数で見る。</h2>
          </Reveal>
          <PayExamples daily={area.dailyPay} />
        </div>
      </section>

      {/* 1日の流れ */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <Kicker animate>1日の流れ</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">配送センターから、直帰まで。</h2>
          </Reveal>
          <DayFlow />
        </div>
      </section>

      {/* 車両・研修：左右分割（中央縦線・カードなし） */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <Kicker animate>車両と研修</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">はじめ方を、支える。</h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 md:gap-0">
            <Reveal className="md:pr-12">
              <h3 className="text-xl font-black text-ink">車両について</h3>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-relaxed text-ink-sub">
                <li>車両リース制度あり（月額30,000円）</li>
                <li>ご自身の軽バンの持ち込みも可能</li>
                <li>車の購入代行も可能</li>
                <li>黒ナンバー（事業用登録）の手続きは面談時に案内</li>
              </ul>
            </Reveal>
            <Reveal
              delay={0.1}
              className="border-t border-line pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-12"
            >
              <h3 className="text-xl font-black text-ink">研修について</h3>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-relaxed text-ink-sub">
                <li>先輩ドライバーに同乗する横乗り研修</li>
                <li>未経験者向け研修で配送の基礎から習得</li>
                <li>応募から最短5日程度（経験者は最短3日）で稼働開始</li>
                <li>稼働開始後も日額保証で収入をサポート</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 応募の流れ */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Kicker animate>応募の流れ</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">5ステップで、走り出す。</h2>
          </Reveal>
          <ApplyFlow />
        </div>
      </section>

      {/* 地域別FAQ（FAQPage構造化データ付き） */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <Kicker animate>{`${area.addressLocality}のよくある質問`}</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">このエリアの疑問に。</h2>
          </Reveal>
          <FaqAccordion items={area.areaFaq} defaultOpenFirst />
        <Reveal className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 font-bold text-primary-dark underline-offset-4 hover:underline"
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
        </div>
      </section>

      {/* 応募CTA */}
      <CtaSection
        title={`${area.areaName}の軽貨物ドライバーに応募する`}
        text="応募フォームは60秒で入力できます。「まず条件だけ聞きたい」というご相談も歓迎です。"
        place={`job_${area.slug}`}
      />

      {/* 他エリアへの内部リンク */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>ほかの募集エリア</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">他のエリアも見る。</h2>
          </Reveal>
          <AreaCards areas={jobAreas} currentSlug={area.slug} />
          <Reveal className="mt-8">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 font-bold text-primary-dark underline-offset-4 hover:underline"
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
        </div>
      </section>
    </>
  );
}
