import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { jobAreas } from "@/lib/jobs";
import { faqCategories } from "@/lib/faq";
import { webSiteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
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

/** セクション番号＋日本語ラベルのキッカー */
function Kicker({
  n,
  children,
  light = false,
}: {
  n: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className={`text-sm font-black tabular-nums ${light ? "text-primary-light" : "text-primary"}`}
      >
        {n}
      </span>
      <span className={`h-px w-8 ${light ? "bg-white/30" : "bg-primary/40"}`} />
      <span
        className={`text-xs font-bold tracking-wider ${light ? "text-white/70" : "text-ink-sub"}`}
      >
        {children}
      </span>
    </div>
  );
}

export default function HomePage() {
  const topFaqs = faqCategories.flatMap((c) => c.items).slice(0, 5);

  return (
    <>
      <JsonLd data={webSiteJsonLd()} />

      {/* ヒーロー（全面背景写真） */}
      <Hero />

      {/* 01 働くメリット：21,000を主役に */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <Kicker n="01">働くメリット</Kicker>
        </Reveal>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="text-sm font-bold tracking-wider text-ink-sub">
              報酬｜日額保証
            </p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="h-stat text-primary-dark">21,000</span>
              <span className="text-2xl font-black text-primary-dark md:text-3xl">
                円
              </span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-[1.9] text-ink md:text-xl">
              配送件数が伸びない時期も、1日あたりの報酬を保証します。出来高だけの契約と違い、稼働した初日から収入の見通しが立ちます。
            </p>
          </Reveal>
        </div>
        <Reveal>
          <dl className="mt-14 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { t: "支払い", d: "週払い可（規定あり）" },
              { t: "経験", d: "未経験・経験者歓迎" },
              { t: "車両", d: "リース 月額25,000円〜" },
            ].map((item) => (
              <div key={item.d} className="px-0 py-5 sm:px-8 sm:first:pl-0">
                <dt className="text-xs font-bold tracking-wider text-ink-sub">
                  {item.t}
                </dt>
                <dd className="mt-1 text-lg font-black text-ink">{item.d}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* 02 ウィランの軽貨物配送とは：写真と文章の左右分割 */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:gap-14 md:py-28">
          <Reveal>
            <Photo
              src="/images/photos/van-city.webp"
              alt="東京の街を背景に駐車された株式会社ウィランの白い軽バン"
              aspect="aspect-[4/5]"
              rounded="rounded-sm"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Reveal>
          <div className="md:pt-16">
            <Reveal>
              <Kicker n="02">株式会社ウィランの軽貨物配送</Kicker>
            </Reveal>
            <Reveal>
              <p className="text-2xl leading-[1.5] font-black text-ink md:text-4xl md:leading-[1.4]">
                Amazonの荷物を、
                <br />
                担当エリアの個人宅へ。
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-7 space-y-5 text-[1.0625rem] leading-[1.9] text-ink-sub">
                <p>
                  配送センターで荷物を積み込み、決まったエリアを回ります。軽バンで運べる小さな荷物が中心で、22時以降の配送は原則ありません。配り終えれば、そのまま直帰できます。
                </p>
                <p>
                  担当エリアはほぼ固定です。建物や駐車位置を覚えるほど配送は速くなり、同じ時間でより多く回れるようになります。
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 日額21,000円保証：濃色全面背景 */}
      <section className="bg-emerald-ink">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <Kicker n="03" light>
              日額21,000円保証
            </Kicker>
          </Reveal>
          <div className="grid items-end gap-8 md:grid-cols-[auto_1fr] md:gap-16">
            <Reveal>
              <p className="flex items-baseline gap-2 text-white">
                <span className="h-stat">21,000</span>
                <span className="text-2xl font-black md:text-3xl">円/日</span>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-md text-base leading-[1.9] text-white/80 md:text-lg">
                宅配は、慣れるほど速くなる仕事です。だからこそ、最初の収入を保証します。配達件数に関係なく日額21,000円（規定あり）。働いた分を早く受け取れる週払いにも対応しています。
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 月額報酬例：表形式 */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:py-28">
        <Reveal>
          <Kicker n="04">月額の報酬例</Kicker>
        </Reveal>
        <Reveal>
          <p className="mb-10 max-w-2xl text-[1.0625rem] leading-[1.9] text-ink-sub">
            日額21,000円で稼働した場合の目安です。稼働日数は週3日から相談できます。
          </p>
        </Reveal>
        <PayExamples />
      </section>

      {/* 05 未経験から始める：写真＋01/02/03 */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:gap-14 md:py-28">
          <div>
            <Reveal>
              <Kicker n="05">未経験から始める</Kicker>
            </Reveal>
            <Reveal>
              <h2 className="h-section text-ink">
                初めてでも、
                <br />
                現場で覚えられる。
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 hidden md:block">
              <Photo
                src="/images/photos/training.webp"
                alt="先輩スタッフから配送の流れを教わる未経験のドライバー"
                aspect="aspect-[4/3]"
                rounded="rounded-sm"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Reveal>
          </div>
          <div>
            {[
              {
                t: "横乗り研修",
                d: "初日は先輩の助手席へ。荷物の積み方、配送アプリの使い方、再配達の流れを、実際の現場で覚えます。",
              },
              {
                t: "日額保証つき",
                d: "件数がまだ少ない時期も日額21,000円（規定あり）。焦らず配送のコツをつかめます。",
              },
              {
                t: "車も知識も、後から",
                d: "車両は月額25,000円からのリースを利用できます。黒ナンバーの手続きや確定申告の疑問も、面談と研修で順に案内します。",
              },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 0.08}>
                <div className="relative border-b border-line py-7 first:border-t">
                  <span className="bg-numeral pointer-events-none absolute -top-2 right-0 text-6xl md:text-7xl">
                    0{i + 1}
                  </span>
                  <h3 className="relative text-xl font-black text-ink">
                    {item.t}
                  </h3>
                  <p className="relative mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink-sub">
                    {item.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 06 仕事内容：写真を大きく */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.4fr_1fr] md:gap-14 md:py-28">
          <Reveal>
            <Photo
              src="/images/photos/work-loading.webp"
              alt="配送センターで軽バンに荷物を積み込む株式会社ウィランのドライバー"
              aspect="aspect-[4/3]"
              rounded="rounded-sm"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </Reveal>
          <div>
            <Reveal>
              <Kicker n="06">仕事内容</Kicker>
            </Reveal>
            <Reveal>
              <h2 className="h-section text-ink">軽バンで運ぶ、宅配。</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-7 space-y-3.5 text-[1.0625rem] leading-relaxed text-ink">
                {[
                  "主にAmazon関連の宅配案件",
                  "軽バンで運べる小さな荷物が中心",
                  "担当エリア制。道を覚えるほど効率が上がる",
                  "9〜21時の間で実働8時間程度・直帰OK",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-primary"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                href="/work"
                className="mt-8 inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
              >
                仕事内容をくわしく見る
                <ArrowIcon />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 07 1日の流れ：縦タイムライン */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <Reveal>
            <Kicker n="07">1日の流れ</Kicker>
          </Reveal>
          <Reveal>
            <h2 className="h-section mb-12 text-ink">配送センターから、直帰まで。</h2>
          </Reveal>
          <DayFlow />
        </div>
      </section>

      {/* 08 募集エリア：写真タイル */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <Kicker n="08">募集エリア</Kicker>
          </Reveal>
          <Reveal>
            <h2 className="h-section mb-4 text-ink">東京4区と、千葉・船橋。</h2>
          </Reveal>
          <Reveal>
            <p className="mb-10 max-w-2xl text-[1.0625rem] leading-[1.9] text-ink-sub">
              品川区・江東区・江戸川区の葛西エリア・船橋市で募集中。待遇と研修はどのエリアも共通です。
            </p>
          </Reveal>
          <AreaCards areas={jobAreas} />
          <Reveal className="mt-8">
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

      {/* 09 車両：左右比較 */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <Reveal>
            <Kicker n="09">車両</Kicker>
          </Reveal>
          <Reveal>
            <h2 className="h-section mb-12 text-ink">
              リースでも、持ち込みでも。
            </h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 md:gap-0">
            <Reveal className="md:pr-12">
              <p className="text-sm font-bold text-primary">車を持っていない方</p>
              <p className="mt-2 text-2xl font-black text-ink md:text-3xl">
                車両リース
                <br />
                <span className="text-primary-dark">月額25,000円〜</span>
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-sub">
                配送用の軽バンをリースできます。まとまった初期費用を用意せずに始められます。リース条件は面談時に案内します。
              </p>
            </Reveal>
            <Reveal
              delay={0.1}
              className="border-t border-line pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-12"
            >
              <p className="text-sm font-bold text-primary">車を持っている方</p>
              <p className="mt-2 text-2xl font-black text-ink md:text-3xl">
                持ち込みで
                <br />
                そのまま稼働
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-sub">
                自分の軽バンで稼働できます。黒ナンバー（事業用登録）の手続きが未了でも、面談時に流れを案内します。
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 10 研修・サポート：濃色背景・白カードなし */}
      <section className="bg-emerald-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-28">
          <div>
            <Reveal>
              <Kicker n="10" light>
                研修とサポート
              </Kicker>
            </Reveal>
            <Reveal>
              <h2 className="h-section text-white">
                はたらく人を
                <br />
                支える仕組み。
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-base leading-[1.9] text-white/70">
                入社祝金・紹介報奨金には規定・条件があります。詳細は面談時に確認できます。
              </p>
            </Reveal>
          </div>
          <div className="border-t border-white/15">
            {[
              {
                t: "横乗り研修",
                d: "先輩の車に同乗し、配送の流れを一通り体験してから独り立ちします。",
              },
              {
                t: "未経験者向け研修",
                d: "荷物の扱い方、配送アプリ、再配達の対応を基礎から確認します。",
              },
              {
                t: "確定申告の相談・税理士紹介",
                d: "経費や申告の疑問を相談でき、必要に応じて税理士を紹介します。",
              },
              {
                t: "入社祝金・紹介報奨金",
                d: "規定・条件に基づく祝金と、知人紹介への報奨金があります。",
              },
              {
                t: "服装・髪型・ネイル自由",
                d: "清潔感を保てば、身だしなみは自由です。",
              },
              {
                t: "社員登用制度",
                d: "業務委託から始めて、希望に応じて社員登用を相談できます。",
              },
            ].map((item, i) => (
              <Reveal key={item.t} delay={Math.min(i * 0.05, 0.25)}>
                <div className="flex gap-5 border-b border-white/15 py-5">
                  <span className="text-sm font-black tabular-nums text-primary-light">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-black text-white">{item.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">
                      {item.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11 独立支援：大きな写真＋短いコピー */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-14 md:py-28">
          <Reveal className="md:order-2">
            <Photo
              src="/images/photos/driver-portrait.webp"
              alt="株式会社ウィランで働く軽貨物ドライバー"
              aspect="aspect-[4/3]"
              rounded="rounded-sm"
              position="object-[center_30%]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Reveal>
          <div className="md:order-1">
            <Reveal>
              <Kicker n="11">独立・起業支援</Kicker>
            </Reveal>
            <Reveal>
              <h2 className="h-section text-ink">配送だけで、終わらない。</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[1.0625rem] leading-[1.9] text-ink-sub">
                軽貨物は、働き方しだいで個人事業の経営を実践できる仕事です。経費の管理や確定申告について相談でき、必要に応じて税理士を紹介します。
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ol className="mt-8 border-t border-line">
                {[
                  "業務委託ドライバーとして配送の基礎を作る",
                  "稼働管理・経費・確定申告を実践で覚える",
                  "独立支援制度を使って、自分の目標へ進む",
                ].map((t, i) => (
                  <li
                    key={t}
                    className="flex items-start gap-4 border-b border-line py-4"
                  >
                    <span className="text-sm font-black tabular-nums text-primary">
                      0{i + 1}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-ink">
                      {t}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/independence-support"
                className="mt-6 inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
              >
                独立・開業サポートを見る
                <ArrowIcon />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 12 向いている人：大きな文章 */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <Reveal>
            <Kicker n="12">向いている人</Kicker>
          </Reveal>
          <div className="mt-4 space-y-6 md:space-y-8">
            {[
              "一人で黙々と働きたい。",
              "安定した報酬を確保したい。",
              "将来は、自分で事業を始めたい。",
            ].map((t, i) => (
              <Reveal key={t} delay={i * 0.1}>
                <p className="text-3xl leading-tight font-black tracking-tight text-ink md:text-6xl">
                  {t}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 text-[1.0625rem] text-ink-sub">
              ひとつでも当てはまれば、まず話を聞きに来てください。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 13 応募の流れ：タイムライン */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <Reveal>
            <Kicker n="13">応募から稼働開始まで</Kicker>
          </Reveal>
          <Reveal>
            <h2 className="h-section mb-12 text-ink">5ステップで、走り出す。</h2>
          </Reveal>
          <ApplyFlow />
        </div>
      </section>

      {/* 14 よくある質問 */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <Reveal>
            <Kicker n="14">よくある質問</Kicker>
          </Reveal>
          <Reveal>
            <h2 className="h-section mb-10 text-ink">応募の前に。</h2>
          </Reveal>
          <FaqAccordion items={topFaqs} defaultOpenFirst />
          <Reveal className="mt-8">
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

      {/* 最終応募導線 */}
      <CtaSection place="home_bottom" />

      {/* 会社情報（事実の表） */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <Reveal>
          <Kicker n="15">会社情報</Kicker>
        </Reveal>
        <Reveal>
          <dl className="border-t border-line">
            {[
              ["会社名", siteConfig.companyName],
              ["代表者", siteConfig.representative],
              [
                "所在地",
                `${siteConfig.address.postalCode} ${siteConfig.address.full}`,
              ],
              ["電話", siteConfig.phoneDisplay],
              ["事業内容", siteConfig.business],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 border-b border-line py-4 md:flex-row md:gap-8"
              >
                <dt className="w-32 shrink-0 text-sm font-bold text-ink-sub">
                  {label}
                </dt>
                <dd className="text-[0.95rem] text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal className="mt-6">
          <Link
            href="/company"
            className="inline-flex items-center gap-1 text-sm font-bold text-primary underline-offset-4 hover:underline"
          >
            会社情報の詳細を見る
            <ArrowIcon />
          </Link>
        </Reveal>
      </section>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
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
