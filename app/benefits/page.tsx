import type { Metadata } from "next";
import Link from "next/link";
import { jobCommon } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { PayExamples } from "@/components/job/PayExamples";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "ウィランで働くメリット｜日額保証・週払い・独立支援",
  description:
    "株式会社ウィランで軽貨物ドライバーとして働くメリットを紹介。日額21,000円保証・週払い可・車両リース月額25,000円〜・横乗り研修・独立支援制度・税理士紹介など、未経験でも安心のサポート体制です。",
  alternates: { canonical: "/benefits" },
  openGraph: {
    title: "ウィランで働くメリット｜株式会社ウィラン",
    description:
      "日額21,000円保証・週払い可・車両リース・研修・独立支援。ウィランで働く8つのメリットを紹介します。",
    url: "/benefits",
    type: "website",
  },
};

const bigMerits = [
  {
    title: "日額21,000円の報酬保証",
    text: "軽貨物業界では出来高制のみの契約も少なくありませんが、ウィランは日額21,000円以上を保証（規定あり）。配達件数がまだ伸びない時期でも、収入の見通しを立てながら働けます。",
  },
  {
    title: "週払いに対応",
    text: "規定に基づき週払いが可能です。「初月の収入までの生活費が不安」という、仕事を変えるときの一番の心配を小さくできます。",
  },
  {
    title: "車がなくても始められる車両リース",
    text: "配送用の軽バンを月額25,000円からリースできます。もちろん持ち込みもOK。初期投資を抑えて、まず始めてみることができます。",
  },
  {
    title: "未経験前提の研修体制",
    text: "先輩ドライバーが同乗する横乗り研修と、未経験者向け研修を用意。荷物の積み方から配送アプリの使い方、再配達の対応まで実践形式で覚えられます。",
  },
  {
    title: "独立・起業までを見据えた支援",
    text: "独立支援制度に加えて、確定申告の相談・税理士紹介など、個人事業主としての土台づくりをサポート。「配送で稼ぐ」の先のキャリアまで一緒に考えます。",
  },
  {
    title: "自由度の高い働き方",
    text: "服装・髪型・ネイル自由。稼働は週3日から相談可能で、配送完了後は直帰できます。仕事とプライベートのバランスを取りやすい環境です。",
  },
] as const;

export default function BenefitsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "ウィランで働くメリット", path: "/benefits" }]} />

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Benefits
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              ウィランで働くメリット
            </h1>
            <p className="mt-5 max-w-3xl leading-loose text-ink-sub">
              軽貨物ドライバーの求人は数多くありますが、報酬体系やサポートの内容は会社によって大きく異なります。株式会社ウィランは「未経験から安心して始められて、長く稼ぎ続けられること」を軸に待遇を設計しています。
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Photo
              src="/images/photos/driver-portrait.webp"
              alt="株式会社ウィランで働く軽貨物ドライバー"
              aspect="aspect-[16/9]"
              sizes="(max-width: 896px) 100vw, 896px"
              position="object-[center_30%]"
              priority
            />
          </Reveal>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="sr-only">ウィランで働く6つのメリット</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {bigMerits.map((merit, i) => (
            <Reveal key={merit.title} delay={(i % 2) * 0.08} className="h-full">
              <div className="flex h-full gap-5 rounded-2xl border border-line bg-white p-7 shadow-card">
                <span className="text-4xl font-black text-primary/20 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg leading-snug font-black text-ink">
                    {merit.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-sub">
                    {merit.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 待遇一覧 */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Support"
            title="待遇・サポート一覧"
            lead="祝金・報奨金などの各制度には規定・条件があります。詳細は面談時にご確認ください。"
          />
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2">
              {jobCommon.support.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 shadow-card"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.8a1 1 0 0 0-1.4-1.4L9 10.1 7.7 8.8a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-bold text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 報酬例 */}
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow="Simulation" title="月額報酬例" />
        <PayExamples />
        <Reveal className="mt-8 text-center">
          <p className="text-sm text-ink-sub">
            報酬の仕組みについて詳しくは
            <Link
              href="/column/daily-guarantee-vs-piecework"
              className="font-bold text-primary underline underline-offset-2"
            >
              「日額保証と出来高制の違い」
            </Link>
            の記事でも解説しています。
          </p>
        </Reveal>
      </section>

      <CtaSection place="benefits" />
    </>
  );
}
