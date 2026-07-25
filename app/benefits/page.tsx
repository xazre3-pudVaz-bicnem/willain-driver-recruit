import type { Metadata } from "next";
import Link from "next/link";
import { jobCommon } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
import { PageHero } from "@/components/ui/PageHero";
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
      "日額21,000円保証・週払い可・車両リース・研修・独立支援。ウィランで働くメリットを紹介します。",
    url: "/benefits",
    type: "website",
  },
};

const bigMerits = [
  {
    title: "日額21,000円の報酬保証",
    text: "出来高制のみの契約が多い業界で、ウィランは日額21,000円以上を保証（規定あり）。配達件数が伸びない時期も、収入の見通しを立てて働けます。",
  },
  {
    title: "週払いに対応",
    text: "規定に基づき週払いが可能。仕事を変えるときに気になる「初月の収入までの生活費」の不安を小さくできます。",
  },
  {
    title: "車がなくても始められる",
    text: "配送用の軽バンを月額25,000円からリース可能。持ち込みもOKで、初期投資を抑えて始められます。",
  },
  {
    title: "未経験前提の研修",
    text: "横乗り研修と未経験者向け研修を用意。荷物の積み方、配送アプリ、再配達の対応まで現場で覚えられます。",
  },
  {
    title: "独立・起業までの支援",
    text: "独立支援制度に加え、確定申告の相談・税理士紹介など、個人事業主としての土台づくりを支援します。",
  },
  {
    title: "自由度の高い働き方",
    text: "服装・髪型・ネイル自由。週3日から相談でき、配送完了後は直帰。予定を組み立てやすい働き方です。",
  },
] as const;

export default function BenefitsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "働くメリット", path: "/benefits" }]} />

      <PageHero
        kicker="働くメリット"
        title="長く、安定して稼ぐために。"
        lead="軽貨物ドライバーの求人は数多くありますが、報酬体系やサポートの内容は会社によって大きく異なります。ウィランは「未経験から始められて、長く稼ぎ続けられること」を軸に待遇を設計しています。"
      />

      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-16">
        <Reveal>
          <Photo
            src="/images/photos/driver-portrait.webp"
            alt="株式会社ウィランで働く軽貨物ドライバー"
            aspect="aspect-[16/7]"
            rounded="rounded-sm"
            sizes="(max-width: 1152px) 100vw, 1152px"
            position="object-[center_28%]"
            priority
          />
        </Reveal>
      </section>

      {/* メリット：罫線区切りの番号付きリスト（カードなし） */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Kicker animate>選ばれる理由</Kicker>
        <Reveal>
          <h2 className="h-section mb-10 text-ink">ウィランで働く6つの理由。</h2>
        </Reveal>
        <div className="grid gap-x-14 md:grid-cols-2">
          {bigMerits.map((merit, i) => (
            <Reveal key={merit.title} delay={(i % 2) * 0.08}>
              <div className="flex gap-5 border-b border-line py-7">
                <span className="text-3xl font-black tabular-nums text-primary/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg leading-snug font-black text-ink">
                    {merit.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-sub">
                    {merit.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 待遇一覧：濃色背景・半透明罫線（白カードなし） */}
      <section className="bg-emerald-ink">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <Kicker light animate>
            待遇・サポート一覧
          </Kicker>
          <Reveal>
            <h2 className="h-section text-white">用意している制度。</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 mb-10 max-w-xl text-base leading-[1.9] text-white/70">
              祝金・報奨金などの各制度には規定・条件があります。詳細は面談時に確認できます。
            </p>
          </Reveal>
          <div className="grid border-t border-white/15 sm:grid-cols-2 sm:gap-x-12">
            {jobCommon.support.map((item, i) => (
              <Reveal key={item} delay={Math.min((i % 2) * 0.06, 0.12)}>
                <div className="flex items-baseline gap-4 border-b border-white/15 py-4">
                  <span className="text-xs font-black tabular-nums text-primary-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-bold text-white">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 報酬例 */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Kicker animate>月額の報酬例</Kicker>
        <Reveal>
          <h2 className="h-section mb-10 text-ink">日額×稼働日数で見る。</h2>
        </Reveal>
        <PayExamples />
        <Reveal className="mt-8">
          <p className="text-sm text-ink-sub">
            報酬の仕組みは
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
