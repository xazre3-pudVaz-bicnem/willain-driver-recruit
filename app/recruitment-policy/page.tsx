import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "求人情報の掲載・更新方針｜運営者情報",
  description:
    "株式会社ウィラン採用サイトの求人情報の掲載・更新方針と運営者情報です。求人条件の確認方法、最終確認は面談時に行うこと、税務・法務情報は専門家への確認を推奨することを明記しています。",
  alternates: { canonical: "/recruitment-policy" },
  openGraph: {
    title: "求人情報の掲載・更新方針｜株式会社ウィラン",
    description:
      "求人条件の確認方法・更新方針・運営者情報をまとめています。",
    url: "/recruitment-policy",
    type: "website",
  },
};

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "運営者",
    body: (
      <>
        <p>
          本サイトは、東京・千葉エリアで軽貨物配送事業（宅配・企業配送）を行う
          {siteConfig.companyName}（{siteConfig.brandName}）が、
          自社の軽貨物ドライバー（業務委託）採用のために運営しています。
        </p>
        <p className="mt-3">
          掲載しているのは自社が募集する求人であり、他社求人を仲介する
          人材紹介・人材派遣サイトではありません。
        </p>
      </>
    ),
  },
  {
    heading: "求人情報の確認体制",
    body: (
      <>
        <p>
          報酬・勤務時間・勤務日数・車両・研修などの求人条件は、
          {siteConfig.companyName}の採用担当が、実際の募集内容にもとづいて確認・掲載しています。
        </p>
        <p className="mt-3">
          個人名の掲載は行っていませんが、著者・確認者は同社の採用担当（組織著者）です。
          担当している業務は、募集条件の整理、応募者からの問い合わせ対応、面談の案内です。
        </p>
      </>
    ),
  },
  {
    heading: "求人情報の更新方針",
    body: (
      <>
        <p>
          求人条件を変更した場合は、該当ページと構造化データ（JobPosting）を同時に更新します。
          画面に表示する内容と構造化データは同一のデータから生成しており、
          報酬や勤務地が食い違わない構成にしています。
        </p>
        <p className="mt-3">
          募集を終了したエリアは、求人詳細ページと JobPosting を削除・更新します。
          再ビルドしただけで公開日・更新日を変更することはしません。
        </p>
      </>
    ),
  },
  {
    heading: "最終確認のお願い",
    body: (
      <>
        <p>
          掲載している条件は募集時点の内容です。
          <strong className="font-bold">
            担当エリア・集合場所・案件内容・最新の条件は、面談時に必ずご確認ください。
          </strong>
        </p>
        <p className="mt-3">
          確定申告・保険・契約などの税務・法務に関する記事は一般的な情報です。
          個別の判断は、税理士・行政書士・運輸支局などの専門家や公的機関へご確認ください。
        </p>
      </>
    ),
  },
  {
    heading: "誤りの修正",
    body: (
      <p>
        掲載内容に誤りを見つけた場合や、事実と異なる点がある場合は、
        お電話（{siteConfig.phoneDisplay}）または
        <Link href="/apply" className="font-bold text-primary-dark underline underline-offset-2">
          応募フォーム
        </Link>
        の相談欄からお知らせください。確認のうえ速やかに修正します。
      </p>
    ),
  },
];

export default function RecruitmentPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "求人情報の掲載・更新方針", path: "/recruitment-policy" }]} />
      <PageHero
        kicker="運営者情報・掲載方針"
        title="求人情報の掲載・更新方針。"
        lead="本サイトの運営者、求人情報をどのように確認・更新しているか、面談時の最終確認のお願いをまとめています。"
      />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.heading}>
              <Kicker>{s.heading}</Kicker>
              <div className="mt-2 text-[1.0625rem] leading-[1.9] text-ink-sub">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-line pt-8">
          <p className="text-sm text-ink-sub">
            会社の基本情報は
            <Link href="/company" className="font-bold text-primary-dark underline underline-offset-2">
              会社情報ページ
            </Link>
            、個人情報の取り扱いは
            <Link href="/privacy" className="font-bold text-primary-dark underline underline-offset-2">
              プライバシーポリシー
            </Link>
            をご覧ください。最終更新日：2026年7月28日
          </p>
        </Reveal>
      </div>
    </>
  );
}
