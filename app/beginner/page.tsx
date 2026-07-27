import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ApplyFlow } from "@/components/job/ApplyFlow";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "未経験の方へ｜研修と日額保証で始める軽貨物ドライバー",
  description:
    "軽貨物ドライバーが初めての方へ。株式会社ウィランは横乗り研修・未経験者向け研修・日額20,000円〜の日額保証で未経験からのスタートを支えます。必要なのは普通免許（AT限定可）だけ。東京・千葉で募集中。",
  alternates: { canonical: "/beginner" },
  openGraph: {
    title: "未経験から始める軽貨物ドライバー｜株式会社ウィラン",
    description:
      "横乗り研修・日額20,000円〜の保証・車両リースあり。未経験からのスタートを支える仕組みを紹介します。",
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
      "日額保証（規定あり・エリアにより日額20,000〜22,000円）があるため、配達スピードが上がる前でも収入の見通しが立ちます。宅配は2〜3ヶ月で慣れていく方が多い仕事です。焦らずに成長できます。",
  },
  {
    worry: "車を持っていない",
    answer:
      "月額30,000円の車両リース制度があります。まとまった初期費用を用意しなくても、リース車両でそのまま稼働を始められます。購入をご希望の場合は車の購入代行も可能です。",
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

      <PageHero
        kicker="未経験の方へ"
        title="初めてでも、現場で覚えられる。"
        lead="「配送の経験がない」「業務委託が初めて」。新しい仕事を始めるとき、不安を感じるのは自然なことです。ウィランは、研修・日額保証・車両リース・確定申告サポートで未経験の一歩目を支えています。必要なのは普通自動車免許（AT限定可）だけです。"
      />

      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-16">
        <Reveal>
          <Photo
            src="/images/photos/training.webp"
            alt="先輩スタッフから配送の流れを教わる未経験のドライバー"
            aspect="aspect-[16/7]"
            rounded="rounded-sm"
            sizes="(max-width: 1152px) 100vw, 1152px"
            priority
          />
        </Reveal>
      </section>

      {/* 不安への回答：罫線区切り（箱で囲まない） */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Kicker animate>よくある不安</Kicker>
        <Reveal>
          <h2 className="h-section mb-10 text-ink">その不安、こう解消します。</h2>
        </Reveal>
        <div className="border-t border-line">
          {worries.map((item, i) => (
            <Reveal key={item.worry} delay={Math.min(i * 0.05, 0.2)}>
              <div className="grid gap-x-6 border-b border-line py-7 md:grid-cols-[1fr_1.4fr]">
                <h3 className="flex items-baseline gap-3 text-lg font-black text-ink">
                  <span className="text-sm tabular-nums text-primary-dark">
                    0{i + 1}
                  </span>
                  「{item.worry}」
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-sub md:mt-0">
                  {item.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 始め方 */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Kicker animate>スタートの流れ</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">応募から、稼働まで。</h2>
          </Reveal>
          <ApplyFlow />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <Kicker animate>よくある質問</Kicker>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">未経験の方から、よく届く質問。</h2>
          </Reveal>
          <FaqAccordion items={beginnerFaq} defaultOpenFirst />
          <Reveal className="mt-8">
            <p className="text-sm text-ink-sub">
              始め方の全体像は
              <Link
                href="/column/start-from-beginner"
                className="font-bold text-primary-dark underline underline-offset-2"
              >
                「未経験から軽貨物ドライバーを始める流れ」
              </Link>
              の記事でも解説しています。
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection
        title="未経験からの応募、歓迎します"
        text="「まず話だけ聞きたい」も大歓迎。あなたの状況に合わせたスタート方法を一緒に考えます。"
        place="beginner"
      />
    </>
  );
}
