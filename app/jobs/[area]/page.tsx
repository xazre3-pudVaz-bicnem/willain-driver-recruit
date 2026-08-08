import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { jobAreas, getJobArea, jobCommon } from "@/lib/jobs";
import { getArticle } from "@/content/column";
import { jobPostingJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JobConditionsTable } from "@/components/job/JobConditionsTable";
import { PayExamples } from "@/components/job/PayExamples";
import { AreaCards } from "@/components/job/AreaCards";
import { CtaSection } from "@/components/job/CtaSection";
import { JobViewTracker } from "@/components/job/JobViewTracker";

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
      <JsonLd
        data={webPageJsonLd({
          title: area.h1,
          path: `/jobs/${area.slug}`,
          image: area.image,
          dateModified: area.dateModified,
        })}
      />
      <JobViewTracker jobId={area.identifier} jobArea={area.slug} />
      <Breadcrumbs
        items={[
          { name: "軽貨物ドライバー求人一覧", path: "/jobs" },
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
          {area.spotlight && area.spotlightNote && (
            <Reveal className="mt-8">
              <div className="rounded-2xl border-2 border-primary/30 bg-mint px-6 py-5">
                <span className="inline-block rounded-full bg-primary-dark px-3 py-1 text-xs font-black tracking-wider text-white">
                  今月の注力エリア
                </span>
                <p className="mt-2 leading-relaxed text-ink">{area.spotlightNote}</p>
                <Link
                  href={`/apply?area=${area.slug}`}
                  className="mt-3 inline-flex items-center gap-1 font-bold text-primary-dark underline-offset-4 hover:underline"
                >
                  {area.areaName}の求人に応募する（約60秒）
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 3.5L10.5 8L6 12.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* エリアの特徴：罫線区切りの番号付きリスト（カードなし） */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>{`${area.addressLocality}で働く`}</Kicker>
          <Reveal>
            <h2 className="h-section mb-4 text-ink">このエリアの特徴。</h2>
          </Reveal>
          <Reveal>
            <p className="mb-10 max-w-2xl text-[0.95rem] leading-relaxed text-ink-sub">
              以下は、株式会社ウィランが配送業務や公開情報から把握している範囲の一般的な傾向です。担当エリアや配送先の詳細、集合場所は、応募後の面談でご案内します。
            </p>
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

      {/* 共通のご案内：仕事内容・車両・研修・応募（全エリア共通は専用ページへ集約し重複を避ける） */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <Kicker animate>仕事内容・車両・研修・応募</Kicker>
          <Reveal>
            <h2 className="h-section mb-4 text-ink">共通の内容は、専用ページで。</h2>
          </Reveal>
          <Reveal>
            <p className="mb-8 max-w-2xl leading-relaxed text-ink-sub">
              {area.areaName}の報酬・勤務条件は上の募集要項のとおりです。1日の流れ・車両・研修・応募の手順は全エリア共通のため、専用ページでくわしく確認できます。
            </p>
          </Reveal>
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/work",
                  t: "仕事内容と1日の流れを見る",
                  d: "配送センターでの積み込みから直帰まで",
                },
                {
                  href: "/benefits",
                  t: "車両（リース月額30,000円）・報酬・待遇を見る",
                  d: "持ち込み・購入代行・日額保証・週払い",
                },
                {
                  href: "/beginner",
                  t: "未経験者向けの横乗り研修を見る",
                  d: "最短5日程度（経験者は最短3日）で稼働開始",
                },
                {
                  href: "/apply",
                  t: "応募の流れを確認して応募する",
                  d: "フォームは約60秒。相談だけでも可",
                },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col justify-between gap-1 border border-line px-5 py-4 transition-colors hover:border-primary-dark"
                  >
                    <span className="flex items-center justify-between gap-2 font-bold text-ink group-hover:text-primary-dark">
                      {item.t}
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-primary-dark transition-transform group-hover:translate-x-1"
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
                    </span>
                    <span className="text-sm text-ink-sub">{item.d}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
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

      {/* 関連ページ・関連コラム（内部リンク・具体的アンカー） */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Kicker animate>あわせて読みたい</Kicker>
          <Reveal>
            <h2 className="h-section mb-8 text-ink">応募前に確認する。</h2>
          </Reveal>
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/work", t: "軽貨物ドライバーの仕事内容を見る" },
                { href: "/beginner", t: "未経験者向けの横乗り研修を確認する" },
                { href: "/benefits", t: "日額保証・週払い・車両リースを確認する" },
                {
                  href: "/independence-support",
                  t: "軽貨物の独立・開業支援を確認する",
                },
                ...area.relatedArticles
                  .map((slug) => {
                    const a = getArticle(slug);
                    return a
                      ? { href: `/column/${a.slug}`, t: `${a.title}を読む` }
                      : null;
                  })
                  .filter((x): x is { href: string; t: string } => x !== null),
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-3 border border-line bg-white px-5 py-4 font-bold text-ink transition-colors hover:border-primary-dark hover:text-primary-dark"
                  >
                    {item.t}
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-primary-dark transition-transform group-hover:translate-x-1"
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
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 応募CTA（希望エリアを自動選択） */}
      <CtaSection
        title={`${area.areaName}の軽貨物ドライバーに応募する`}
        text="応募フォームは60秒で入力できます。「まず条件だけ聞きたい」というご相談も歓迎です。"
        place={`job_${area.slug}`}
        area={area.slug}
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
