import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "独立・開業サポート｜軽貨物から始めるキャリア支援",
  description:
    "株式会社ウィランの独立支援制度を紹介します。軽貨物ドライバーとして経験を積みながら、確定申告サポート・税理士紹介・独立支援制度で、独立・開業を目指す方のキャリアを東京・千葉で支援します。",
  alternates: { canonical: "/independence-support" },
  openGraph: {
    title: "独立・開業サポート｜株式会社ウィラン",
    description:
      "軽貨物ドライバーから独立・開業へ。ウィランの独立支援制度とキャリアステップを紹介します。",
    url: "/independence-support",
    type: "website",
  },
};

const steps = [
  {
    phase: "STEP 1",
    title: "業務委託ドライバーとして基礎を築く",
    text: "まずは軽貨物ドライバーとして安定して稼げる状態をつくります。日額21,000円保証のもとで配送スキルを磨きながら、個人事業主としての第一歩を踏み出します。",
  },
  {
    phase: "STEP 2",
    title: "個人事業の運営感覚を身につける",
    text: "稼働管理・経費の考え方・確定申告など、個人事業主に必要な知識を実践で習得。ウィランでは確定申告の相談や税理士の紹介など、事業運営の土台づくりをサポートします。",
  },
  {
    phase: "STEP 3",
    title: "独立支援制度で次のステージへ",
    text: "経験を積んだ先の独立・開業に向けて、独立支援制度を用意しています。目指す姿は人それぞれ。あなたの目標に合わせた進み方を面談で一緒に考えます。",
  },
] as const;

const supports = [
  {
    title: "独立支援制度",
    text: "軽貨物事業での独立を目指す方向けの支援制度です。制度の内容・条件は面談時に詳しくご案内します。",
  },
  {
    title: "確定申告サポート・税理士紹介",
    text: "個人事業主として避けて通れない税務。確定申告に関する相談を受け付け、必要に応じて税理士を紹介します。",
  },
  {
    title: "社員登用制度",
    text: "独立とは別の道として、社員登用の制度もあります。「組織の中でキャリアを積みたい」という希望にも応えます。",
  },
  {
    title: "経験者からのアドバイス",
    text: "現場で稼働するドライバーや運営メンバーから、実践的な働き方・稼ぎ方のアドバイスを受けられる環境です。",
  },
] as const;

export default function IndependenceSupportPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ name: "独立・開業サポート", path: "/independence-support" }]}
      />

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Independence
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              独立・開業サポート
            </h1>
            <p className="mt-5 max-w-3xl leading-loose text-ink-sub">
              軽貨物ドライバーは、配送の仕事であると同時に「小さな事業の経営」でもあります。株式会社ウィランは、業務委託ドライバーとしての稼働を独立・開業への助走期間と捉え、将来の目標に向けたキャリアを支援します。もちろん「独立は考えていない」という方も、そのままドライバーとして長く活躍できます。
            </p>
          </Reveal>
        </div>
      </div>

      {/* ステップ */}
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Career Step"
          title="独立までの3ステップ"
          lead="進むペースは人それぞれです。無理のないステップで、着実に力をつけていきます。"
        />
        <div className="space-y-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="grid gap-4 rounded-2xl border border-line bg-white p-7 shadow-card md:grid-cols-[120px_1fr] md:items-start">
                <p className="text-2xl font-black text-primary/30">{step.phase}</p>
                <div>
                  <h3 className="text-lg font-black text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-sub">
                    {step.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* サポート内容 */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SectionHeading eyebrow="Support" title="サポート内容" />
          <div className="grid gap-5 md:grid-cols-2">
            {supports.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-card">
                  <h3 className="font-black text-ink">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-sub">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <p className="rounded-xl border border-line bg-white px-5 py-4 text-xs leading-relaxed text-ink-sub md:text-sm">
              ※独立・開業の成果を保証するものではありません。各制度には規定・条件があります。ご自身の状況に合わせた進め方は面談時にご相談ください。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 関連コラム */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Column"
          title="独立を考え始めた方へ"
          lead="独立・開業に関する基礎知識は採用コラムでも解説しています。"
        />
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/column/independence-guide"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              軽貨物から独立・開業を目指す方法とステップ
            </Link>
            <Link
              href="/column/gyomu-itaku-basics"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              軽貨物の業務委託とは？雇用契約との違い
            </Link>
            <Link
              href="/column/tax-return-basics"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              軽貨物ドライバーが確定申告前に確認したいこと
            </Link>
          </div>
        </Reveal>
      </section>

      <CtaSection
        title="将来の独立も、今の安定も。"
        text="独立への関心度がどの段階でも構いません。あなたの目標を面談でお聞かせください。"
        place="independence"
      />
    </>
  );
}
