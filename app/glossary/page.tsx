import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site-config";
import { webPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "軽貨物ドライバー用語集｜黒ナンバー・業務委託・日額保証をわかりやすく",
  description:
    "軽貨物ドライバーの仕事でよく使う用語を、これから始める方向けにわかりやすくまとめた用語集です。業務委託・黒ナンバー・日額保証・横乗り研修・車両リースなどの意味と関連ページを確認できます。",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "軽貨物ドライバー用語集｜株式会社ウィラン",
    description:
      "業務委託・黒ナンバー・日額保証・横乗り研修・車両リースなど、軽貨物の基本用語をわかりやすく解説。",
    url: "/glossary",
    type: "website",
  },
};

type Term = {
  id: string;
  term: string;
  reading?: string;
  def: string;
  link?: { href: string; label: string };
  /** 制度・税務・法務など、断定を避け公的機関の確認を促す用語 */
  official?: boolean;
};

type Group = { heading: string; terms: Term[] };

const groups: Group[] = [
  {
    heading: "仕事・働き方",
    terms: [
      {
        id: "light-cargo-driver",
        term: "軽貨物ドライバー",
        reading: "けいかもつどらいばー",
        def: "軽自動車（軽バンなど）を使って、通販商品などの荷物を個人宅や企業へ届ける配送ドライバー。株式会社ウィランでは主にAmazon関連の宅配案件を担当します。",
        link: { href: "/work", label: "仕事内容を見る" },
      },
      {
        id: "gyomu-itaku",
        term: "業務委託",
        reading: "ぎょうむいたく",
        def: "会社に雇用されるのではなく、事業者（個人事業主）として仕事を請け負う契約形態。報酬・経費・働き方の条件は契約内容が基準になります。",
        link: { href: "/column/gyomu-itaku-basics", label: "業務委託と雇用の違いを読む" },
      },
      {
        id: "ride-along",
        term: "横乗り研修",
        reading: "よこのりけんしゅう",
        def: "先輩ドライバーの車に同乗し、荷物の積み方・配送アプリの操作・不在時の対応などを実際の流れに沿って覚える研修。未経験者が最初に受ける一般的なステップです。",
        link: { href: "/beginner", label: "未経験からの始め方を見る" },
      },
      {
        id: "day-off-early",
        term: "早上がり",
        reading: "はやあがり",
        def: "その日の配送が予定より早く終わった場合に、担当分を配り終えた時点で業務を終えられること。案件や状況によります。",
      },
      {
        id: "chokki",
        term: "直帰",
        reading: "ちょっき",
        def: "配送完了後に営業所へ戻らず、そのまま帰宅できること。軽貨物の宅配案件では一般的な働き方です。",
      },
    ],
  },
  {
    heading: "お金・報酬",
    terms: [
      {
        id: "daily-guarantee",
        term: "日額保証",
        reading: "にちがくほしょう",
        def: "配達件数に関わらず、1日あたりの報酬を一定額保証する仕組み。規定があります。株式会社ウィランではエリアにより日額20,500〜22,000円です。",
        link: { href: "/benefits", label: "報酬・待遇を見る" },
      },
      {
        id: "piecework",
        term: "出来高制（歩合）",
        reading: "できだかせい",
        def: "配達した件数などに応じて報酬が決まる仕組み。件数が伸びれば報酬も増えますが、少ない日は下がります。日額保証と対になる考え方です。",
        link: { href: "/column/daily-guarantee-vs-piecework", label: "日額保証との違いを読む" },
      },
      {
        id: "weekly-pay",
        term: "週払い",
        reading: "しゅうばらい",
        def: "報酬を1週間単位など短いサイクルで受け取れる支払い方法。規定があります。まとまった支払いを待たずに受け取りたい方に向いています。",
        link: { href: "/column/weekly-payment-jobs", label: "週払いの確認ポイントを読む" },
      },
      {
        id: "gross-net",
        term: "額面と手取り",
        reading: "がくめんとてどり",
        def: "額面は経費や税金を引く前の金額、手取りは各種を差し引いて実際に手元に残る金額。業務委託では経費を自分で負担するため、両者は大きく異なります。",
        link: { href: "/tools/reward-simulator", label: "報酬・経費シミュレーターで試算する" },
      },
      {
        id: "vehicle-lease",
        term: "車両リース",
        reading: "しゃりょうりーす",
        def: "配送用の軽バンを月額で借りる制度。車を持っていない方も始められます。株式会社ウィランでは月額30,000円（契約条件あり）。購入代行も可能です。",
        link: { href: "/column/vehicle-lease-vs-own", label: "リースと持ち込みの違いを読む" },
      },
    ],
  },
  {
    heading: "車両・制度",
    terms: [
      {
        id: "black-number",
        term: "黒ナンバー（事業用軽自動車）",
        reading: "くろなんばー",
        def: "有償で貨物を運ぶ軽自動車に必要な事業用のナンバープレート（黒地に黄文字）。貨物軽自動車運送事業の届出を行って取得します。手続きの詳細は運輸支局などでご確認ください。",
        link: { href: "/column/black-number-basics", label: "黒ナンバーの基礎を読む" },
        official: true,
      },
      {
        id: "at-license",
        term: "AT限定免許",
        reading: "えーてぃーげんてい",
        def: "オートマチック車のみ運転できる普通自動車運転免許。軽貨物の配送はAT車が中心のため、AT限定でも応募・稼働できます。",
        link: { href: "/column/license-requirements", label: "必要な免許を読む" },
      },
      {
        id: "kaigyou",
        term: "開業届",
        reading: "かいぎょうとどけ",
        def: "個人事業を始めたことを税務署へ届け出る書類。提出時期や書き方の要件は制度により変わるため、国税庁や税理士へご確認ください。",
        official: true,
      },
      {
        id: "kakutei-shinkoku",
        term: "確定申告",
        reading: "かくていしんこく",
        def: "1年間の所得と税額を計算して申告する手続き。業務委託の軽貨物ドライバーは原則として自分で行います。要件は状況により異なるため、国税庁や税理士へご確認ください。",
        link: { href: "/column/tax-return-basics", label: "確定申告前の確認事項を読む" },
        official: true,
      },
      {
        id: "invoice",
        term: "インボイス制度",
        reading: "いんぼいすせいど",
        def: "適格請求書（インボイス）に関する消費税の仕組み。個人事業主にも関係する場合があります。取り扱いは制度改正で変わるため、国税庁の情報をご確認ください。",
        official: true,
      },
    ],
  },
  {
    heading: "配送実務",
    terms: [
      {
        id: "depot",
        term: "配送センター（デポ）",
        reading: "はいそうせんたー",
        def: "配送する荷物を積み込む拠点。1日はここで荷物を受け取り、担当エリアへ向かうところから始まります。所在地は案件により異なり、面談時に案内されます。",
      },
      {
        id: "redelivery",
        term: "再配達",
        reading: "さいはいたつ",
        def: "受取人が不在などで届けられなかった荷物を、あらためて配達すること。置き配や時間帯の工夫で件数を抑えられる場合があります。",
      },
      {
        id: "okihai",
        term: "置き配",
        reading: "おきはい",
        def: "対面ではなく玄関前や宅配ボックスなど、指定された場所に荷物を置いて完了する配達方法。再配達を減らす手段として広がっています。",
      },
      {
        id: "spot",
        term: "スポット便",
        reading: "すぽっとびん",
        def: "定期の宅配案件とは別に、単発で発生する配送依頼。案件によって内容や報酬の考え方が異なります。",
        link: { href: "/column/delivery-types", label: "配送の種類の違いを読む" },
      },
      {
        id: "last-one-mile",
        term: "ラストワンマイル",
        reading: "らすとわんまいる",
        def: "物流の最終区間、つまり配送拠点から受取人の手元へ届ける区間のこと。軽貨物ドライバーが主に担うのはこの領域です。",
      },
    ],
  },
];

const allTerms = groups.flatMap((g) => g.terms);

export default function GlossaryPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "軽貨物ドライバー用語集",
          path: "/glossary",
          image: "/images/photos/app-scan.webp",
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          "@id": `${absoluteUrl("/glossary")}#glossary`,
          name: "軽貨物ドライバー用語集",
          url: absoluteUrl("/glossary"),
          inLanguage: "ja",
          hasDefinedTerm: allTerms.map((t) => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.def,
            url: `${absoluteUrl("/glossary")}#${t.id}`,
            inDefinedTermSet: `${absoluteUrl("/glossary")}#glossary`,
          })),
        }}
      />
      <Breadcrumbs items={[{ name: "軽貨物ドライバー用語集", path: "/glossary" }]} />
      <PageHero
        kicker="用語集"
        title="軽貨物の言葉を、やさしく。"
        lead="軽貨物ドライバーの仕事でよく出てくる用語を、これから始める方向けにまとめました。気になる言葉から、関連するページへ進めます。"
      />

      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        {/* 用語インデックス */}
        <nav aria-label="用語の索引" className="rounded-2xl border border-line bg-paper px-6 py-5">
          <p className="text-sm font-black text-ink">この用語集の項目</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-sub">
            {allTerms.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="underline-offset-2 hover:text-primary-dark hover:underline">
                  {t.term}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {groups.map((g) => (
          <section key={g.heading} className="mt-12">
            <Kicker>{g.heading}</Kicker>
            <dl className="mt-4 divide-y divide-line border-t border-line">
              {g.terms.map((t) => (
                <div key={t.id} id={t.id} className="scroll-mt-24 py-6">
                  <dt className="text-lg font-black text-ink">
                    {t.term}
                    {t.reading && (
                      <span className="ml-2 text-xs font-normal text-ink-sub">
                        {t.reading}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-2 leading-relaxed text-ink-sub">
                    {t.def}
                    {t.link && (
                      <>
                        {" "}
                        <Link
                          href={t.link.href}
                          className="font-bold text-primary-dark underline underline-offset-2"
                        >
                          {t.link.label}
                        </Link>
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <p className="mt-12 rounded-xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-ink-sub">
          税金・確定申告・インボイス・黒ナンバーなどの制度・手続きは変更される場合があります。最新情報は国税庁、国土交通省、管轄の運輸支局、税理士などへご確認ください。
        </p>

        <div className="mt-10 border-t border-line pt-8">
          <p className="text-sm font-bold text-ink">関連ページ</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/jobs", t: "東京・千葉の軽貨物ドライバー求人一覧を見る" },
              { href: "/beginner", t: "未経験者向けの始め方・研修を見る" },
              { href: "/column", t: "採用コラムをテーマ別に読む" },
              { href: "/tools/reward-simulator", t: "報酬・経費シミュレーターで試算する" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-3 border border-line px-5 py-4 font-bold text-ink transition-colors hover:border-primary-dark hover:text-primary-dark"
                >
                  {l.t}
                  <span aria-hidden className="text-primary-dark">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CtaSection place="glossary" />
    </>
  );
}
