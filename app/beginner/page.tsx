import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ApplyFlow } from "@/components/job/ApplyFlow";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "未経験の方へ｜研修と日額保証で始める軽貨物ドライバー",
  description:
    "軽貨物ドライバーが初めての方へ。株式会社ウィランは横乗り研修・未経験者向け研修・日額21,000円保証で未経験からのスタートを支えます。必要なのは普通免許（AT限定可）だけ。東京・千葉で募集中。",
  alternates: { canonical: "/beginner" },
  openGraph: {
    title: "未経験から始める軽貨物ドライバー｜株式会社ウィラン",
    description:
      "横乗り研修・日額21,000円保証・車両リースあり。未経験からのスタートを支える仕組みを紹介します。",
    url: "/beginner",
    type: "website",
  },
};

const worries = [
  {
    worry: "配送の仕事をしたことがない",
    answer:
      "横乗り研修で先輩ドライバーの1日に同乗し、荷物の積み込みから配達完了までの流れを実際に見て覚えられます。配送アプリの使い方や不在時の対応など、未経験者向け研修で基礎から身につきます。",
  },
  {
    worry: "最初から件数を配れる自信がない",
    answer:
      "日額21,000円の保証（規定あり）があるため、配達スピードが上がる前でも収入の見通しが立ちます。宅配は2〜3ヶ月で慣れていく方が多い仕事です。焦らずに成長できます。",
  },
  {
    worry: "車を持っていない",
    answer:
      "月額25,000円からの車両リース制度があります。まとまった初期費用を用意しなくても、リース車両でそのまま稼働を始められます。",
  },
  {
    worry: "業務委託や確定申告がよく分からない",
    answer:
      "面談時に業務委託契約の仕組みを丁寧に説明します。確定申告についても相談でき、必要に応じて税理士の紹介も可能です。分からないまま契約を進めることはありません。",
  },
  {
    worry: "AT限定免許しか持っていない",
    answer:
      "問題ありません。応募に必要なのは普通自動車運転免許のみで、AT限定でも応募できます。配送用の軽バンはAT車が中心です。",
  },
] as const;

const beginnerFaq = [
  {
    q: "研修期間はどれくらいですか？",
    a: "習得のペースに合わせて案内するため、期間は面談時にご確認ください。横乗り研修で流れを覚えてから独り立ちする形です。",
  },
  {
    q: "研修中の報酬はどうなりますか？",
    a: "研修時の条件については面談時にご案内します。気になる点は応募フォームの相談欄でも質問できます。",
  },
  {
    q: "体力に自信がなくても大丈夫ですか？",
    a: "軽バンで運べる比較的軽い荷物が中心のため、重量物を扱う配送より体への負担は小さめです。実際の荷物のイメージは面談・研修で確認できます。",
  },
  {
    q: "道を覚えるのが苦手です。",
    a: "配送アプリとカーナビを使って配達するため、最初から道を覚えている必要はありません。担当エリア制なので、走るほど自然に道に慣れていきます。",
  },
];

export default function BeginnerPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "未経験の方へ", path: "/beginner" }]} />

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              For Beginners
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              未経験から始める軽貨物ドライバー
            </h1>
            <p className="mt-5 max-w-3xl leading-loose text-ink-sub">
              「配送の経験がない」「業務委託が初めて」。新しい仕事を始めるとき、こうした不安を感じるのは自然なことです。だからこそウィランは、研修・日額保証・車両リース・確定申告サポートという4つの仕組みで、未経験の一歩目を支えています。必要なのは普通自動車免許（AT限定可）だけです。
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Photo
              src="/images/photos/training.webp"
              alt="先輩スタッフから配送の流れを教わる未経験のドライバー"
              aspect="aspect-[16/9]"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </Reveal>
        </div>
      </div>

      {/* 不安への回答 */}
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Q&A"
          title="その不安、こう解消します"
        />
        <div className="space-y-5">
          {worries.map((item, i) => (
            <Reveal key={item.worry} delay={Math.min(i * 0.05, 0.2)}>
              <div className="rounded-2xl border border-line bg-white p-7 shadow-card">
                <h3 className="flex items-start gap-3 text-lg font-black text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm text-white"
                  >
                    {i + 1}
                  </span>
                  「{item.worry}」
                </h3>
                <p className="mt-3 pl-10 text-sm leading-relaxed text-ink-sub">
                  {item.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 始め方 */}
      <section className="bg-mint/60 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Flow"
            title="未経験からのスタートの流れ"
            lead="応募から稼働開始までのステップです。詳しいスケジュールは面談時にご案内します。"
          />
          <ApplyFlow />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading eyebrow="FAQ" title="未経験の方からよくある質問" />
        <FaqAccordion items={beginnerFaq} />
        <Reveal className="mt-8 text-center">
          <p className="text-sm text-ink-sub">
            始め方の全体像は
            <Link
              href="/column/start-from-beginner"
              className="font-bold text-primary underline underline-offset-2"
            >
              「未経験から軽貨物ドライバーを始める流れ」
            </Link>
            の記事でも詳しく解説しています。
          </p>
        </Reveal>
      </section>

      <CtaSection
        title="未経験からの応募、歓迎します"
        text="「まず話だけ聞きたい」も大歓迎。あなたの状況に合わせたスタート方法を一緒に考えます。"
        place="beginner"
      />
    </>
  );
}
