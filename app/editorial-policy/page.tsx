import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "採用コラムの編集方針｜情報の確認と出典",
  description:
    "株式会社ウィラン採用コラムの編集方針です。一次情報の参照、税務・法務情報の扱い、公開日と更新日の管理、根拠のない数値を掲載しない方針を明記しています。",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "採用コラムの編集方針｜株式会社ウィラン",
    description: "情報の確認方法・出典・公開日と更新日の管理方針をまとめています。",
    url: "/editorial-policy",
    type: "website",
  },
};

const policies: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "著者・監修",
    body: (
      <p>
        採用コラムは、{siteConfig.companyName}の採用担当（組織著者）が執筆・確認しています。
        軽貨物配送事業を運営する当事者の視点から、これから軽貨物ドライバーを検討する方に向けて、
        仕事内容・報酬・車両・独立などの実務的な情報をまとめています。
      </p>
    ),
  },
  {
    heading: "事実確認と出典",
    body: (
      <>
        <p>
          記事では、根拠のない報酬相場・平均年収・定着率などの数値は掲載しません。
          統計や制度に触れる場合は、国税庁・国土交通省・各自治体・政府統計などの
          一次情報を確認し、必要に応じて出典を明記します。
        </p>
        <p className="mt-3">
          税務・保険・契約などの内容は一般的な情報です。個別の判断は、
          税理士・行政書士・運輸支局・保険会社など、専門家や公的機関へのご確認をおすすめします。
        </p>
      </>
    ),
  },
  {
    heading: "自社求人の扱い",
    body: (
      <p>
        記事内で{siteConfig.companyName}の求人条件を紹介する場合は、
        求人ページと同じ内容にそろえます。記事全体を求人広告にはせず、
        中立的な注意点も併記します。求人条件は変更されることがあるため、
        最新の条件は各
        <Link href="/jobs" className="font-bold text-primary-dark underline underline-offset-2">
          求人ページ
        </Link>
        と面談時にご確認ください。
      </p>
    ),
  },
  {
    heading: "公開日と更新日",
    body: (
      <p>
        記事には公開日と更新日を分けて表示します。内容を実際に見直した場合のみ更新日を変更し、
        再ビルドしただけで日付を書き換えることはしません。
      </p>
    ),
  },
  {
    heading: "画像について",
    body: (
      <p>
        サイトで使用している人物・車両・街並みの写真は、内容をわかりやすく伝えるための
        イメージ画像です。実在の社員・実車・実際の配送現場を撮影したものではありません。
        実写の素材を用意でき次第、順次差し替えます。
      </p>
    ),
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "採用コラムの編集方針", path: "/editorial-policy" }]} />
      <PageHero
        kicker="編集方針"
        title="採用コラムの編集方針。"
        lead="採用コラムをどのような体制で執筆・確認し、出典や日付をどう扱っているかをまとめています。"
      />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          {policies.map((p) => (
            <section key={p.heading}>
              <Kicker>{p.heading}</Kicker>
              <div className="mt-2 text-[1.0625rem] leading-[1.9] text-ink-sub">
                {p.body}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-14 border-t border-line pt-8 text-sm text-ink-sub">
          求人情報の掲載・更新方針は
          <Link
            href="/recruitment-policy"
            className="font-bold text-primary-dark underline underline-offset-2"
          >
            求人情報の掲載・更新方針
          </Link>
          をご覧ください。最終更新日：2026年7月28日
        </p>
      </div>
    </>
  );
}
