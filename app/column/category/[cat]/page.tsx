import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { publishedColumnArticles } from "@/content/column";
import type { ColumnCategory } from "@/lib/column";
import { absoluteUrl } from "@/lib/site-config";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { CtaSection } from "@/components/job/CtaSection";

/**
 * 採用コラムのカテゴリーハブ。
 * /column/[slug]（記事詳細）と衝突しないよう /column/category/[cat] に配置する。
 * 記事一覧だけでなく、人間が管理する固定の解説文（800〜1,500字程度）を持つ。
 * 記事が3本未満のカテゴリーは薄いページになるため公開しない。
 */

type Hub = {
  slug: string;
  category: ColumnCategory;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  intro: string[];
  learn: string[];
  relatedPages: { href: string; label: string }[];
};

const HUBS: Hub[] = [
  {
    slug: "work",
    category: "仕事内容",
    metaTitle: "軽貨物ドライバーの仕事内容コラム｜1日の流れ・配送実務",
    metaDescription:
      "軽貨物ドライバーの仕事内容に関する採用コラムをまとめたページです。1日の流れ、宅配便ドライバーとの違い、配送の種類など、応募前に仕事の実態を理解するための記事を紹介します。",
    h1: "軽貨物ドライバーの仕事内容",
    lead: "配送の一日の流れ、荷物の扱い、宅配便ドライバーとの違いなど、仕事の中身を理解するための記事を集めました。",
    intro: [
      "軽貨物ドライバーの仕事は、軽バンを使って通販商品などの小型の荷物を個人宅や企業へ届ける配送業務です。株式会社ウィランでは主にAmazon関連の宅配案件を担当し、配送センターで荷物を積み込んで担当エリアを回ります。担当エリアはほぼ固定のため、建物や駐車位置を覚えるほど配送は速くなり、同じ時間でより多くの荷物を届けられるようになります。",
      "「一日の流れが想像できない」「宅配便ドライバーとどう違うのか」「自分に向いているか」——仕事内容カテゴリーの記事では、こうした応募前の疑問に、実務の順序に沿って具体的に答えていきます。求人広告だけではわかりにくい配送の実態を、注意点も含めて整理しています。",
      "まずは仕事の全体像をつかみ、そのうえで報酬や契約、車両などの条件を確認していくと、ミスマッチの少ない応募につながります。仕事内容をひととおり理解したら、募集エリアごとの求人ページで具体的な条件を確認してください。",
    ],
    learn: [
      "軽貨物ドライバーの一日の仕事の流れ",
      "軽貨物と宅配便・スポット便などの違い",
      "自分に向いている働き方かどうかの判断材料",
    ],
    relatedPages: [
      { href: "/work", label: "軽貨物ドライバーの仕事内容ページを見る" },
      { href: "/jobs", label: "東京・千葉の軽貨物ドライバー求人一覧を見る" },
    ],
  },
  {
    slug: "contract",
    category: "働き方・契約",
    metaTitle: "軽貨物の働き方・業務委託契約コラム｜未経験・免許・週3",
    metaDescription:
      "軽貨物ドライバーの働き方と業務委託契約に関する採用コラムをまとめたページです。未経験からの始め方、必要な免許、週3日勤務、面談の確認事項など、契約前に知りたい情報を紹介します。",
    h1: "軽貨物の働き方・業務委託契約",
    lead: "業務委託という契約形態、必要な免許、未経験からの始め方、面談で確認したいことなど、働き方と契約の記事をまとめました。",
    intro: [
      "軽貨物ドライバーの多くは、雇用契約ではなく業務委託契約で働きます。会社に雇われる働き方と異なり、条件は契約書の内容が基準になります。だからこそ、報酬の支払い方、経費の範囲、契約の解除条件などを、契約前に具体的に確認しておくことが大切です。",
      "このカテゴリーでは、業務委託と雇用の違い、普通免許やAT限定でも働けるか、週3日から始められるか、副業として取り組む際の注意点、面談で確認しておきたい項目などを扱います。未経験の方が横乗り研修からどのように仕事を覚えていくのかも、実際の流れに沿って紹介します。",
      "働き方の自由度が高い一方で、自分で判断・管理する場面も増えます。メリットだけでなく注意点も理解したうえで、面談で最終的な条件を確認することをおすすめします。",
    ],
    learn: [
      "業務委託契約と雇用契約の違い",
      "必要な免許・未経験からの始め方",
      "週3日勤務や副業として働く際の確認事項",
    ],
    relatedPages: [
      { href: "/beginner", label: "未経験者向けの始め方・研修を見る" },
      { href: "/jobs", label: "募集エリアと条件を求人ページで見る" },
    ],
  },
  {
    slug: "money",
    category: "お金・報酬",
    metaTitle: "軽貨物の報酬・経費コラム｜日額保証・手取り・週払い",
    metaDescription:
      "軽貨物ドライバーの報酬と経費に関する採用コラムをまとめたページです。日額保証の仕組み、額面と手取りの違い、必要な経費、ガソリン代、週払いなど、お金まわりの疑問を解消します。",
    h1: "軽貨物の報酬・経費",
    lead: "日額保証の仕組み、額面と手取りの違い、必要な経費やガソリン代など、お金にまつわる記事をまとめました。",
    intro: [
      "報酬は、軽貨物ドライバーを検討するうえで最も気になる項目のひとつです。ただし、提示される日額や月額はあくまで「額面」であり、業務委託では車両費・ガソリン代・保険料などの経費を自分で負担します。さらに税金や社会保険も別にかかるため、額面と実際に手元へ残る額は異なります。",
      "このカテゴリーでは、日額保証の仕組み、額面と手取りの違い、必要な経費の内訳、ガソリン代の考え方、週払いの条件などを、断定を避けながら整理します。数字だけを比較するのではなく、経費や稼働日数まで含めて見ることが、後悔しない判断につながります。",
      "報酬の目安を具体的に試したい方は、日額と経費を入力して残額の参考値を計算できるシミュレーターもあわせてご利用ください。",
    ],
    learn: [
      "日額保証の仕組みと注意点",
      "額面・経費・手取りの関係",
      "ガソリン代など必要な経費の考え方",
    ],
    relatedPages: [
      { href: "/tools/reward-simulator", label: "報酬・経費シミュレーターで試算する" },
      { href: "/benefits", label: "報酬・待遇（日額保証・週払い）を見る" },
    ],
  },
  {
    slug: "independence",
    category: "独立・キャリア",
    metaTitle: "軽貨物の独立・確定申告コラム｜黒ナンバー・開業",
    metaDescription:
      "軽貨物ドライバーの独立・開業・確定申告に関する採用コラムをまとめたページです。黒ナンバー、開業の流れ、確定申告の基本など、個人事業として続けるための情報を紹介します。",
    h1: "軽貨物の独立・キャリア",
    lead: "黒ナンバー、独立・開業までの流れ、確定申告の基本など、個人事業として長く続けるための記事をまとめました。",
    intro: [
      "軽貨物は、働き方しだいで個人事業の経営を実践できる仕事です。配送で収入を得ながら、稼働管理・経費・確定申告を実務のなかで身につけていけるのが特徴です。将来的な独立や法人化を視野に入れる方もいます。",
      "このカテゴリーでは、事業用登録である黒ナンバーの基礎、独立・開業までの一般的な流れ、確定申告で確認したいことなどを扱います。税務・法務・保険などの制度に関する内容は、断定を避け、国税庁・国土交通省・運輸支局などの公的機関や専門家への確認をあわせて案内します。",
      "株式会社ウィランでは、確定申告の相談や税理士の紹介にも対応しています。制度は変わることがあるため、最新の情報は必ず公的機関や専門家でご確認ください。",
    ],
    learn: [
      "黒ナンバー（事業用登録）の基礎",
      "独立・開業までの一般的な流れ",
      "確定申告で確認したいことの全体像",
    ],
    relatedPages: [
      { href: "/independence-support", label: "独立・開業サポートを見る" },
      { href: "/jobs", label: "軽貨物ドライバー求人一覧を見る" },
    ],
  },
];

const hubBySlug = new Map(HUBS.map((h) => [h.slug, h]));

type Props = { params: Promise<{ cat: string }> };

export function generateStaticParams() {
  // 記事が3本以上あるカテゴリーだけ生成（薄いページを作らない）
  return HUBS.filter(
    (h) =>
      publishedColumnArticles.filter((a) => a.category === h.category).length >= 3,
  ).map((h) => ({ cat: h.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const hub = hubBySlug.get(cat);
  if (!hub) return {};
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: { canonical: `/column/category/${hub.slug}` },
    openGraph: {
      title: `${hub.h1}のコラム｜株式会社ウィラン`,
      description: hub.metaDescription,
      url: `/column/category/${hub.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryHubPage({ params }: Props) {
  const { cat } = await params;
  const hub = hubBySlug.get(cat);
  if (!hub) notFound();

  const articles = publishedColumnArticles.filter(
    (a) => a.category === hub.category,
  );
  if (articles.length < 3) notFound();

  const featured = articles.slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "採用コラム", path: "/column" },
          { name: hub.h1, path: `/column/category/${hub.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${hub.h1}のコラム`,
          itemListElement: articles.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: a.title,
            url: absoluteUrl(`/column/${a.slug}`),
          })),
        }}
      />
      <Breadcrumbs
        items={[
          { name: "採用コラム", path: "/column" },
          { name: hub.h1, path: `/column/category/${hub.slug}` },
        ]}
      />
      <PageHero kicker="採用コラム" title={hub.h1} lead={hub.lead} />

      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        {/* カテゴリー解説（固定コンテンツ） */}
        <div className="space-y-5 text-[1.0625rem] leading-[1.9] text-ink-sub">
          {hub.intro.map((p) => (
            <p key={p.slice(0, 16)}>{p}</p>
          ))}
        </div>

        {/* このカテゴリーで分かること */}
        <div className="mt-10 rounded-2xl bg-mint/50 px-6 py-6">
          <p className="font-black text-ink">このカテゴリーで分かること</p>
          <ul className="mt-3 space-y-2">
            {hub.learn.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-ink-sub">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-dark"
                />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* 代表記事 */}
        <section className="mt-12">
          <Kicker>代表的な記事</Kicker>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {featured.map((a) => (
              <Link
                key={a.slug}
                href={`/column/${a.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-colors hover:border-primary-dark"
              >
                <span className="text-xs font-bold text-primary-dark">
                  {a.category}
                </span>
                <span className="mt-2 leading-snug font-black text-ink group-hover:text-primary-dark">
                  {a.title}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 全記事一覧 */}
        <section className="mt-12">
          <Kicker>すべての記事</Kicker>
          <ul className="mt-2 border-t border-line">
            {articles.map((a) => (
              <li key={a.slug} className="border-b border-line">
                <Link
                  href={`/column/${a.slug}`}
                  className="group block py-5"
                >
                  <span className="leading-snug font-black text-ink group-hover:text-primary-dark">
                    {a.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-sub">
                    {a.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 関連ページ */}
        <section className="mt-12 border-t border-line pt-8">
          <p className="text-sm font-bold text-ink">関連ページ・求人</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {hub.relatedPages.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-3 border border-line px-5 py-4 font-bold text-ink transition-colors hover:border-primary-dark hover:text-primary-dark"
                >
                  {l.label}
                  <span aria-hidden className="text-primary-dark">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center">
            <Link
              href="/column"
              className="font-bold text-primary-dark underline-offset-4 hover:underline"
            >
              採用コラム一覧へ戻る
            </Link>
          </p>
        </section>
      </div>

      <CtaSection place={`column_category_${hub.slug}`} />
    </>
  );
}
