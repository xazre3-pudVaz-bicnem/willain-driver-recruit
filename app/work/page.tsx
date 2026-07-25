import type { Metadata } from "next";
import Link from "next/link";
import { jobCommon, jobAreas } from "@/lib/jobs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
import { PageHero } from "@/components/ui/PageHero";
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

const features = [
  {
    title: "主にAmazon関連の配送案件",
    text: "取扱量の多いAmazon関連の案件が中心。荷物が継続的にあるため、稼働が安定します。",
  },
  {
    title: "軽くて運びやすい荷物が中心",
    text: "軽バンで運べるサイズの荷物が中心。日用品や小型の通販商品が多く、扱いやすい内容です。",
  },
  {
    title: "担当エリア制で道を覚えやすい",
    text: "毎回違う場所ではなく担当エリア内での配送。道や建物を覚えるほど配達が速くなります。",
  },
  {
    title: "配送完了後は直帰OK",
    text: "その日の配送が終わればセンターへ戻らず直帰。早く配り終えた日は早上がりも可能です。",
  },
  {
    title: "夜22時以降の配送は原則なし",
    text: "勤務は9〜21時の間で実働8時間程度。深夜配送は原則なく、生活リズムを保てます。",
  },
  {
    title: "ひとりで進められる仕事",
    text: "配達中は基本的にひとり。自分のペースで黙々と進めたい方に向いています。",
  },
];

export default function WorkPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "仕事内容", path: "/work" }]} />

      <PageHero
        kicker="仕事内容"
        title="軽バンで運ぶ、宅配。"
        lead="株式会社ウィランの軽貨物ドライバーは、インターネット通販の商品を個人宅へ届ける宅配の仕事です。案件は主にAmazon関連。配送センターで荷物を積み込み、担当エリアの住宅へ1件ずつ配達します。軽バンで運べる荷物が中心のため、力仕事のイメージほど体への負担は大きくありません。"
      />

      {/* 業務の3ステップ写真 */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              src: "/images/photos/work-loading.webp",
              alt: "配送センターで軽バンに荷物を積み込むドライバー",
              cap: "荷物を積み込む",
            },
            {
              src: "/images/photos/work-driving.webp",
              alt: "軽バンを運転して担当エリアへ向かうドライバー",
              cap: "担当エリアで配送",
            },
            {
              src: "/images/photos/work-delivery.webp",
              alt: "個人宅へ荷物を手渡しするドライバー",
              cap: "お客様へお届け",
            },
          ].map((item, i) => (
            <Reveal key={item.cap} delay={i * 0.1}>
              <figure>
                <Photo
                  src={item.src}
                  alt={item.alt}
                  aspect="aspect-[4/3]"
                  rounded="rounded-sm"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <figcaption className="mt-3 flex items-baseline gap-2 text-sm font-bold text-ink">
                  <span className="tabular-nums text-primary-dark">0{i + 1}</span>
                  {item.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 仕事の特徴：罫線区切りの番号付きリスト（カードなし） */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>仕事の特徴</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">この仕事の6つの特徴。</h2>
          </Reveal>
          <div className="grid gap-x-12 sm:grid-cols-2">
            {features.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08}>
                <div className="flex gap-5 border-b border-line py-6">
                  <span className="text-2xl font-black tabular-nums text-primary-dark/30">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-black text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-sub">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 具体的な業務内容：罫線区切り（箱で囲まない） */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <Kicker animate>具体的な業務</Kicker>
          <Reveal>
            <h2 className="h-section mb-8 text-ink">配送の中身。</h2>
          </Reveal>
          <Reveal>
            <ul className="border-t border-line">
              {jobCommon.jobDescription.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-line py-4 leading-relaxed text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-primary-dark"
                  />
                  {item}
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
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <Kicker animate>1日の流れ</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">配送センターから、直帰まで。</h2>
          </Reveal>
          <DayFlow />
        </div>
      </section>

      {/* 働き方：罫線区切りの数値表示 */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Kicker animate>働き方</Kicker>
          <Reveal>
            <h2 className="h-section mb-8 text-ink">契約と時間。</h2>
          </Reveal>
          <Reveal>
            <dl className="grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { label: "契約形態", value: jobCommon.contractType },
                { label: "勤務時間", value: jobCommon.workHours },
                { label: "勤務日数", value: jobCommon.workDays },
              ].map((item) => (
                <div key={item.label} className="py-5 sm:px-8 sm:first:pl-0">
                  <dt className="text-xs font-bold tracking-wider text-ink-sub">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-black text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="mt-6">
            <p className="text-sm text-ink-sub">
              報酬は
              <span className="font-bold text-primary-dark">{jobCommon.payLabel}</span>
              （{jobCommon.paySupplement}）。詳しくは
              <Link
                href="/jobs"
                className="font-bold text-primary-dark underline underline-offset-2"
              >
                求人一覧
              </Link>
              をご覧ください。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 募集エリア */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Kicker animate>募集エリア</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">この仕事ができるエリア。</h2>
          </Reveal>
          <AreaCards areas={jobAreas} />
        </div>
      </section>

      <CtaSection place="work" />
    </>
  );
}
