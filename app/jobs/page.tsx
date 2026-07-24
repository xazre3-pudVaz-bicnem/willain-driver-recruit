import type { Metadata } from "next";
import { jobAreas } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AreaCards } from "@/components/job/AreaCards";
import { JobConditionsTable } from "@/components/job/JobConditionsTable";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "軽貨物ドライバー求人一覧（品川・江東・葛西・船橋）",
  description:
    "株式会社ウィランの軽貨物ドライバー求人一覧です。東京都品川区・江東区・江戸川区葛西エリア・千葉県船橋市で業務委託ドライバーを募集中。日額21,000円保証・週払い可・未経験歓迎。",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "軽貨物ドライバー求人一覧｜株式会社ウィラン",
    description:
      "東京都品川区・江東区・葛西エリア・千葉県船橋市で軽貨物ドライバー（業務委託）を募集中。日額21,000円保証・週払い可・未経験歓迎。",
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

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Jobs
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              軽貨物ドライバー求人一覧
            </h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-ink-sub">
              株式会社ウィランでは、東京都品川区・江東区・江戸川区葛西エリア・千葉県船橋市の4エリアで軽貨物ドライバー（業務委託）を募集しています。待遇・報酬・研修体制はどのエリアも共通です。お住まいや希望に合わせてエリアの求人詳細をご覧ください。
            </p>
          </Reveal>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="sr-only">募集エリア別の求人</h2>
        <AreaCards areas={jobAreas} />
      </section>

      <section className="bg-mint/60 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Conditions"
            title="共通の募集要項"
            lead="以下の条件は全エリア共通です。エリアごとの詳しい説明は各求人詳細ページをご覧ください。"
          />
          <Reveal>
            <JobConditionsTable />
          </Reveal>
        </div>
      </section>

      <CtaSection place="jobs_list" />
    </>
  );
}
