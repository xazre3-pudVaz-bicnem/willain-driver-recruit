import type { Metadata } from "next";
import Link from "next/link";
import { jobCommon, jobAreas } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { DayFlow } from "@/components/job/DayFlow";
import { AreaCards } from "@/components/job/AreaCards";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "仕事内容｜Amazon関連の宅配が中心の軽貨物配送",
  description:
    "株式会社ウィランの軽貨物ドライバーの仕事内容を紹介します。Amazon関連のインターネット通販商品を個人宅へ配送。軽バンで運べる軽い荷物中心・配送完了後は直帰可・22時以降の配送は原則なし。",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "軽貨物ドライバーの仕事内容｜株式会社ウィラン",
    description:
      "Amazon関連の宅配案件が中心。軽い荷物中心・直帰OK・22時以降の配送は原則なし。仕事内容を詳しく紹介します。",
    url: "/work",
    type: "website",
  },
};

export default function WorkPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "仕事内容", path: "/work" }]} />

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Work
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              軽貨物ドライバーの仕事内容
            </h1>
            <p className="mt-5 max-w-3xl leading-loose text-ink-sub">
              株式会社ウィランの軽貨物ドライバーは、インターネット通販で購入された商品を個人のお客様へ届ける宅配の仕事です。案件は主にAmazon関連。配送センターで荷物を積み込み、担当エリアの住宅へ1件ずつ配達します。軽バンで運べる比較的軽い荷物が中心のため、力仕事のイメージほど体への負担は大きくありません。
            </p>
          </Reveal>
        </div>
      </div>

      {/* 業務の3ステップ写真 */}
      <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              src: "/images/photos/work-loading.webp",
              alt: "配送センターで軽バンに荷物を積み込むドライバー",
              cap: "1. 荷物を積み込む",
            },
            {
              src: "/images/photos/work-driving.webp",
              alt: "軽バンを運転して担当エリアへ向かうドライバー",
              cap: "2. 担当エリアで配送",
            },
            {
              src: "/images/photos/work-delivery.webp",
              alt: "個人宅へ荷物を手渡しするドライバー",
              cap: "3. お客様へお届け",
            },
          ].map((item, i) => (
            <Reveal key={item.cap} delay={i * 0.1}>
              <figure>
                <Photo
                  src={item.src}
                  alt={item.alt}
                  aspect="aspect-[4/3]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <figcaption className="mt-3 text-center text-sm font-bold text-ink">
                  {item.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 仕事の全体像 */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow="Overview" title="仕事の特徴" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "主にAmazon関連の配送案件",
              text: "インターネット通販の中でも取扱量が多いAmazon関連の案件が中心。荷物が継続的にあるため、安定した稼働につながります。",
            },
            {
              title: "軽くて運びやすい荷物が中心",
              text: "軽バンで運べるサイズの荷物が中心です。日用品や小型の通販商品が多く、宅配が初めての方でも扱いやすい内容です。",
            },
            {
              title: "担当エリア制で道を覚えやすい",
              text: "毎回違う場所ではなく、担当エリア内での配送です。道や建物を覚えるほど配達がスムーズになります。",
            },
            {
              title: "配送完了後は直帰OK",
              text: "その日の配送が終わればセンターへ戻らず直帰できます。早く配り終えた日は早上がりも可能です。",
            },
            {
              title: "夜22時以降の配送は原則なし",
              text: "勤務は9:00〜21:00の間で実働8時間程度。深夜配送は原則ないため、生活リズムを保ちやすい働き方です。",
            },
            {
              title: "ひとりで進められる仕事",
              text: "配達中は基本的にひとり。自分のペースで黙々と仕事を進めたい方に向いています。",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-card">
                <h3 className="font-black text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-sub">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 具体的な業務 */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading eyebrow="Detail" title="具体的な業務内容" />
          <Reveal>
            <ul className="space-y-3">
              {jobCommon.jobDescription.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-line bg-white px-5 py-4 shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                  />
                  <p className="leading-relaxed text-ink">{item}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-ink-sub">
              {jobCommon.meetingNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 1日の流れ */}
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Schedule"
          title="1日の流れ"
          lead="時間配分は自分で調整できます。慣れるほど1日の組み立てがうまくなる仕事です。"
        />
        <DayFlow />
      </section>

      {/* 働き方の条件 */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <SectionHeading eyebrow="Style" title="働き方" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "契約形態", value: jobCommon.contractType },
              { label: "勤務時間", value: jobCommon.workHours },
              { label: "勤務日数", value: jobCommon.workDays },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-white p-6 text-center shadow-card">
                  <p className="text-xs font-bold text-ink-sub">{item.label}</p>
                  <p className="mt-2 leading-snug font-black text-ink">
                    {item.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <p className="text-center text-sm text-ink-sub">
              報酬は
              <span className="font-bold text-primary">
                {jobCommon.payLabel}
              </span>
              （{jobCommon.paySupplement}）。詳しくは
              <Link
                href="/jobs"
                className="font-bold text-primary underline underline-offset-2"
              >
                求人一覧
              </Link>
              をご覧ください。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 募集エリア */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow="Area" title="この仕事ができる募集エリア" />
        <AreaCards areas={jobAreas} />
      </section>

      <CtaSection place="work" />
    </>
  );
}
