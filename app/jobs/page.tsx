import type { Metadata } from "next";
import { jobAreas } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/Kicker";
import { PageHero } from "@/components/ui/PageHero";
import { AreaCards } from "@/components/job/AreaCards";
import { JobConditionsTable } from "@/components/job/JobConditionsTable";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "軽貨物ドライバー求人一覧（品川・江東・葛西・船橋）",
  description:
    "株式会社ウィランの軽貨物ドライバー求人一覧です。東京都品川区・江東区・江戸川区葛西エリア・千葉県船橋市で業務委託ドライバーを募集中。日額20,000円〜・週払い可・未経験歓迎。",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "軽貨物ドライバー求人一覧｜株式会社ウィラン",
    description:
      "東京都品川区・江東区・葛西エリア・千葉県船橋市で軽貨物ドライバー（業務委託）を募集中。日額20,000円〜・週払い可・未経験歓迎。",
    url: "/jobs",
    type: "website",
  },
};

/**
 * 求人一覧ページ。
 * JobPosting構造化データは各エリア詳細ページのみに実装し、一覧には付けない。
 */
export default function JobsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "求人一覧", path: "/jobs" }]} />

      <PageHero
        kicker="募集エリア・求人一覧"
        title="東京4区と、千葉・船橋。"
        lead="品川区・江東区・江戸川区の葛西エリア・船橋市の4エリアで軽貨物ドライバー（業務委託）を募集しています。待遇・報酬・研修はどのエリアも共通です。お住まいや希望に合わせて求人詳細をご覧ください。"
      />

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 className="sr-only">募集エリア別の求人</h2>
        <AreaCards areas={jobAreas} />
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Kicker animate>共通の募集要項</Kicker>
          <Reveal>
            <h2 className="h-section mb-4 text-ink">全エリア共通の条件。</h2>
          </Reveal>
          <Reveal>
            <p className="mb-8 max-w-2xl text-[1.0625rem] leading-[1.9] text-ink-sub">
              以下の条件は全エリア共通です。エリアごとの詳しい説明は各求人詳細ページをご覧ください。
            </p>
          </Reveal>
          <Reveal>
            <JobConditionsTable />
          </Reveal>
        </div>
      </section>

      <CtaSection place="jobs_list" />
    </>
  );
}
