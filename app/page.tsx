import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { jobCommon, jobAreas } from "@/lib/jobs";
import { faqCategories } from "@/lib/faq";
import { webSiteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Hero } from "@/components/home/Hero";
import { PayExamples } from "@/components/job/PayExamples";
import { DayFlow } from "@/components/job/DayFlow";
import { AreaCards } from "@/components/job/AreaCards";
import { ApplyFlow } from "@/components/job/ApplyFlow";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: {
    absolute: `東京・千葉の軽貨物ドライバー求人｜${siteConfig.companyName}`,
  },
  description:
    "東京・品川・江東・葛西・船橋で軽貨物ドライバーを募集する株式会社ウィランの採用サイトです。日額21,000円保証、週払い対応、未経験歓迎、車両リース・独立支援制度を用意しています。",
  alternates: { canonical: "/" },
  openGraph: {
    title: `東京・千葉の軽貨物ドライバー求人｜${siteConfig.companyName}`,
    description:
      "日額21,000円保証・週払い対応・未経験歓迎。品川・江東・葛西・船橋で軽貨物ドライバー（業務委託）を募集中です。",
    url: "/",
    type: "website",
  },
};

const merits = [
  {
    title: "日額21,000円保証",
    text: "配送に慣れないうちも収入の見通しが立てやすい、日額保証つきの報酬体系です。",
    icon: "yen",
  },
  {
    title: "週払い対応",
    text: "規定に基づき週払いに対応。働いた分を早く受け取りたい方に向いた仕組みです。",
    icon: "calendar",
  },
  {
    title: "未経験歓迎",
    text: "横乗り研修と未経験者向け研修あり。普通免許（AT限定可）があれば始められます。",
    icon: "beginner",
  },
  {
    title: "車両リースあり",
    text: "月額25,000円からのリース制度。車を持っていなくてもスタートできます。",
    icon: "van",
  },
] as const;

const beginnerReasons = [
  {
    title: "先輩と一緒に走る「横乗り研修」",
    text: "初日からひとりにはしません。先輩ドライバーの車に同乗し、荷物の積み込みから配達完了までの流れを実際に見て覚えられます。",
  },
  {
    title: "慣れるまでを支える日額保証",
    text: "宅配は慣れるほど速くなる仕事です。件数が伸びない研修期間や稼働初期も、日額21,000円の保証があるため落ち着いて成長できます。",
  },
  {
    title: "車も知識もゼロからでOK",
    text: "車両は月額25,000円からのリースを利用可能。黒ナンバーの手続きや確定申告の疑問も、面談・研修時に順を追ってご案内します。",
  },
] as const;

export default function HomePage() {
  const topFaqs = faqCategories.flatMap((c) => c.items).slice(0, 5);

  return (
    <>
      <JsonLd data={webSiteJsonLd()} />

      {/* 1. ヒーロー */}
      <Hero />

      {/* 2. 4つのメリット */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <h2 className="sr-only">株式会社ウィランで働く4つのメリット</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {merits.map((merit, i) => (
            <Reveal key={merit.title} delay={i * 0.08} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-white p-5 shadow-card md:p-6">
                <MeritIcon name={merit.icon} />
                <h3 className="mt-3 text-sm leading-snug font-black text-ink md:text-base">
                  {merit.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-sub md:text-sm">
                  {merit.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. ウィランの軽貨物配送とは */}
      <section className="bg-mint/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
                About
              </p>
              <h2 className="mt-3 text-[1.75rem] leading-snug font-black tracking-tight text-ink md:text-4xl">
                株式会社ウィランの軽貨物配送とは
              </h2>
              <div className="mt-6 space-y-5 leading-loose text-ink-sub">
                <p>
                  株式会社ウィランは、東京・千葉エリアでインターネット通販商品の宅配を担う軽貨物配送の会社です。軽貨物ドライバーとは、軽バンなどの軽貨物車両を使って小型の荷物を届ける配送の仕事で、当社では主にAmazon関連の配送案件を扱っています。
                </p>
                <p>
                  ドライバーは業務委託契約のパートナーとして、品川区・江東区・江戸川区葛西エリア・船橋市の担当エリアで稼働します。配送センターで荷物を積み込み、担当エリアの個人宅へ配達し、配送が終わればそのまま直帰。軽バンで運べる比較的軽い荷物が中心のため、体力に自信がない方でも取り組みやすい仕事です。
                </p>
                <p>
                  「未経験から安定して稼ぎたい」「ゆくゆくは独立したい」。そんな一人ひとりの目標に、日額保証・研修・独立支援というかたちで伴走することが、私たちウィランの役割だと考えています。
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Photo
                src="/images/photos/van-city.webp"
                alt="東京の街を背景に駐車された株式会社ウィランの白い軽バン"
                aspect="aspect-[4/3]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. 日額21,000円保証の説明 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Guarantee
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              日額21,000円保証だから、
              <br />
              最初の一歩が踏み出せる。
            </h2>
            <p className="mt-5 leading-relaxed text-ink-sub">
              出来高制だけの契約では、配送に慣れないうちは収入が安定しにくいのが軽貨物業界の実情です。ウィランでは日額21,000円以上の報酬を保証（規定あり）。件数がまだ伸びない時期でも収入の見通しが立つため、未経験の方も安心してスタートできます。
            </p>
            <p className="mt-3 leading-relaxed text-ink-sub">
              さらに週払い（規定あり）にも対応。「今月の生活費が不安」という状態を避けながら、新しい仕事に集中できます。
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-light p-8 text-white shadow-card-hover md:p-10">
              <p className="text-sm font-bold text-white/80">報酬（業務委託）</p>
              <p className="mt-2 text-5xl font-black tracking-tight tabular-nums">
                日額21,000
                <span className="text-2xl">円〜</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm font-medium">
                {[
                  "日額保証つきで収入の見通しが立てやすい",
                  "週払い可能（規定あり）",
                  "配送が早く終われば早上がりも可能",
                  "22時以降の配送は原則なし",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. 月額報酬例 */}
      <section className="bg-mint/60 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Simulation"
            title="月額報酬例"
            lead="日額21,000円×稼働日数のシンプルな計算例です。稼働日数は週3日から相談できます。"
          />
          <PayExamples />
        </div>
      </section>

      {/* 6. 未経験でも始めやすい理由 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="For Beginners"
          title="未経験でも始めやすい3つの理由"
          lead="ウィランのドライバーの多くは、宅配未経験からのスタートを想定した体制で迎えています。"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {beginnerReasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 0.1} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-card">
                <span className="text-3xl font-black text-primary/20 tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="mt-2 text-lg leading-snug font-black text-ink">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                  {reason.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link
            href="/beginner"
            className="inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
          >
            未経験の方向けの詳しい案内を見る
            <ArrowIcon />
          </Link>
        </Reveal>
      </section>

      {/* 7. 仕事内容 */}
      <section className="bg-ink py-16 text-white md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SectionHeading eyebrow="Work" title="仕事内容" />
          <Reveal className="mb-8">
            <Photo
              src="/images/photos/work-loading.webp"
              alt="配送センターで軽バンに荷物を積み込む株式会社ウィランのドライバー"
              aspect="aspect-[16/9]"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <p className="leading-loose text-white/80">
                インターネット通販で購入された商品を、配送センターから個人宅へ届ける宅配ドライバーの仕事です。主にAmazon関連の配送案件を担当し、軽バンで運べる比較的軽い荷物が中心。担当エリア内での配送のため、エリアの道を覚えるほど効率よく回れるようになります。
              </p>
              <Link
                href="/work"
                className="mt-6 inline-flex items-center gap-1 font-bold text-primary-light underline-offset-4 hover:underline"
              >
                仕事内容の詳細ページを見る
                <ArrowIcon />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="space-y-3">
                {jobCommon.jobDescription.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm leading-relaxed"
                  >
                    <CheckIcon className="mt-0.5 shrink-0 text-primary-light" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8. 1日の流れ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="Schedule"
          title="1日の流れ"
          lead="配送完了後は直帰OK。自分のペースで組み立てられる1日です。"
        />
        <DayFlow />
      </section>

      {/* 9. 募集エリア */}
      <section className="bg-mint/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Area"
            title="募集エリア"
            lead="東京都品川区・江東区・江戸川区葛西エリア・千葉県船橋市で募集中。エリアごとの求人詳細をご覧ください。"
          />
          <AreaCards areas={jobAreas} />
          <Reveal className="mt-8 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
            >
              求人一覧を見る
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 10. 車両リース・持ち込み */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="Vehicle"
          title="車両はリースでも、持ち込みでもOK"
        />
        <Reveal className="mx-auto mb-8 max-w-4xl">
          <Photo
            src="/images/photos/van-interior.webp"
            alt="配送に使用する軽バンの運転席まわり"
            aspect="aspect-[16/9]"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl border-2 border-primary bg-white p-8 shadow-card">
              <p className="inline-block rounded-full bg-mint px-3 py-1 text-xs font-black text-primary-dark">
                車を持っていない方
              </p>
              <h3 className="mt-3 text-xl font-black text-ink">
                車両リース制度（月額25,000円〜）
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                配送用の軽バンを月額25,000円からリースできます。まとまった初期投資をせずに始められるため、「まず軽貨物の仕事を試したい」という方に向いています。リース条件の詳細は面談時にご案内します。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <div className="h-full rounded-2xl border border-line bg-white p-8 shadow-card">
              <p className="inline-block rounded-full bg-mint px-3 py-1 text-xs font-black text-primary-dark">
                車を持っている方
              </p>
              <h3 className="mt-3 text-xl font-black text-ink">
                車両持ち込みでの稼働
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                ご自身の軽バンをお持ちの方は、持ち込みでそのまま稼働できます。黒ナンバー（事業用登録）の手続きが済んでいない場合も、面談時に流れをご案内しますのでご安心ください。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11. 研修・サポート体制 */}
      <section className="bg-mint/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Support"
            title="研修・サポート体制"
            lead="はじめての業務委託でも迷わないよう、稼働前から稼働後まで並走します。"
          />
          <Reveal className="mx-auto mb-8 max-w-4xl">
            <Photo
              src="/images/photos/training.webp"
              alt="先輩スタッフと打ち合わせをする株式会社ウィランのドライバー"
              aspect="aspect-[16/9]"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "横乗り研修",
                text: "先輩ドライバーに同乗し、実際の配送の流れを体験しながら学べます。",
              },
              {
                title: "未経験者向け研修",
                text: "荷物の扱い方・配送アプリの使い方・再配達の対応などを基礎から案内します。",
              },
              {
                title: "確定申告サポート",
                text: "業務委託で避けて通れない確定申告について相談でき、税理士の紹介も可能です。",
              },
              {
                title: "入社祝金・紹介報奨金",
                text: "規定・条件に基づき、入社祝金や紹介報奨金の制度があります。詳細は面談でご確認ください。",
              },
              {
                title: "服装・髪型・ネイル自由",
                text: "清潔感を保てば、服装や髪型・ネイルは自由。自分らしく働けます。",
              },
              {
                title: "社員登用制度",
                text: "業務委託から始めて、希望に応じて社員登用の相談ができます。",
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
        </div>
      </section>

      {/* 12. 独立・起業支援 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Independence
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              「稼ぐ」の先にある、
              <br />
              独立・起業まで支援。
            </h2>
            <p className="mt-5 leading-relaxed text-ink-sub">
              ウィランには独立支援制度があります。軽貨物ドライバーは、働き方次第で個人事業主としての経営感覚を実践的に磨ける仕事です。配送スキルだけでなく、確定申告や経費の考え方など、独立に必要な知識も一緒に身につけていけます。
            </p>
            <Link
              href="/independence-support"
              className="mt-6 inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
            >
              独立・開業サポートの詳細を見る
              <ArrowIcon />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="space-y-3">
              {[
                "業務委託ドライバーとして配送と個人事業の基礎を身につける",
                "稼働管理・経費管理・確定申告を実践しながら経営感覚を磨く",
                "独立支援制度を活用し、自分の目標に合わせた次の一歩へ",
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-card"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-ink-sub">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 13. どのような人に向いているか */}
      <section className="bg-mint/60 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <SectionHeading eyebrow="Match" title="こんな方に向いています" />
          <div className="space-y-3">
            {[
              ...jobCommon.welcomeFor,
              "自分のペースで働きながら、しっかり収入を確保したい方",
              "人間関係のストレスが少ない仕事を探している方",
            ].map((item, i) => (
              <Reveal key={item} delay={Math.min(i * 0.06, 0.3)}>
                <div className="flex items-start gap-3 rounded-xl border border-line bg-white px-5 py-4 shadow-card">
                  <CheckIcon className="mt-1 shrink-0 text-primary" />
                  <p className="font-bold text-ink">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 14. 応募から稼働開始までの流れ */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="Flow"
          title="応募から稼働開始までの流れ"
          lead="応募から稼働開始まで、最短のスケジュールは面談時にご案内します。"
        />
        <ApplyFlow />
      </section>

      {/* 15. よくある質問 */}
      <section className="bg-mint/60 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading eyebrow="FAQ" title="よくある質問" />
          <FaqAccordion items={topFaqs} />
          <Reveal className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
            >
              すべての質問を見る
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 16. 応募CTA */}
      <CtaSection place="home_bottom" />

      {/* 17. 会社情報 */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading eyebrow="Company" title="会社情報" />
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full text-left text-sm md:text-base">
              <tbody className="divide-y divide-line">
                {[
                  ["会社名", siteConfig.companyName],
                  ["ブランド表記", siteConfig.brandName],
                  ["代表者", siteConfig.representative],
                  [
                    "本社所在地",
                    `${siteConfig.address.postalCode} ${siteConfig.address.full}`,
                  ],
                  ["電話番号", siteConfig.phoneDisplay],
                  ["事業内容", siteConfig.business],
                ].map(([label, value]) => (
                  <tr key={label} className="flex flex-col md:table-row">
                    <th
                      scope="row"
                      className="bg-mint/70 px-5 pt-3 pb-1 font-bold whitespace-nowrap text-ink md:w-40 md:px-6 md:py-3.5"
                    >
                      {label}
                    </th>
                    <td className="px-5 pt-1 pb-3 text-ink-sub md:px-6 md:py-3.5">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center">
            <Link
              href="/company"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary underline-offset-4 hover:underline"
            >
              会社情報の詳細を見る
              <ArrowIcon />
            </Link>
          </p>
        </Reveal>
      </section>
    </>
  );
}

/* ---------------- アイコン ---------------- */

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.8a1 1 0 0 0-1.4-1.4L9 10.1 7.7 8.8a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
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
  );
}

function MeritIcon({ name }: { name: string }) {
  const common = "h-10 w-10 rounded-xl bg-mint p-2 text-primary";
  switch (name) {
    case "yen":
      return (
        <svg aria-hidden="true" className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4l6 8 6-8M12 12v8M8 14h8M8 17.5h8" />
        </svg>
      );
    case "calendar":
      return (
        <svg aria-hidden="true" className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4M8 15l2.5 2.5L16 13" />
        </svg>
      );
    case "beginner":
      return (
        <svg aria-hidden="true" className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9L9.5 8z" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8a2 2 0 0 1 2-2h9v10H5a2 2 0 0 1-2-2V8Z" />
          <path d="M14 9h3.5a2 2 0 0 1 1.6.8l1.5 2a2 2 0 0 1 .4 1.2V15a1 1 0 0 1-1 1H14V9Z" />
          <circle cx="8" cy="17.5" r="1.8" />
          <circle cx="16.5" cy="17.5" r="1.8" />
        </svg>
      );
  }
}
