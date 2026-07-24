import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "株式会社ウィラン採用サイトのプライバシーポリシーです。応募フォーム等で取得する個人情報の利用目的・管理方法・お問い合わせ窓口について定めています。",
  alternates: { canonical: "/privacy" },
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. 基本方針",
    body: [
      `${siteConfig.companyName}（以下「当社」といいます）は、当社採用サイト（以下「本サイト」といいます）をご利用になる皆様の個人情報を適切に取り扱い、保護することを社会的責務と考え、個人情報の保護に関する法律（個人情報保護法）その他関連法令を遵守します。`,
    ],
  },
  {
    heading: "2. 取得する個人情報",
    body: [
      "当社は、本サイトの応募フォームおよびお電話でのお問い合わせを通じて、氏名、ふりがな、電話番号、メールアドレス、希望エリア、免許・車両の保有状況、希望する働き方、その他ご相談内容などの情報を取得します。",
    ],
  },
  {
    heading: "3. 利用目的",
    body: [
      "取得した個人情報は、次の目的の範囲内で利用します。",
      "（1）採用選考・面談のご連絡およびご案内のため",
      "（2）ご質問・ご相談への回答のため",
      "（3）採用活動に関する情報のご提供のため",
      "（4）お問い合わせ対応に付随する業務のため",
    ],
  },
  {
    heading: "4. 第三者提供",
    body: [
      "当社は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。",
    ],
  },
  {
    heading: "5. 業務委託先への提供",
    body: [
      "当社は、利用目的の達成に必要な範囲内で、メール送信サービス等の外部サービスを利用することがあります。この場合、適切な管理体制を有する委託先を選定し、個人情報の適切な取り扱いを求めます。",
    ],
  },
  {
    heading: "6. 安全管理措置",
    body: [
      "当社は、個人情報の漏えい、滅失またはき損の防止その他個人情報の安全管理のために、必要かつ適切な措置を講じます。",
    ],
  },
  {
    heading: "7. アクセス解析ツールについて",
    body: [
      "本サイトでは、サイトの利用状況を把握し改善するため、Google アナリティクス等のアクセス解析ツールを利用する場合があります。これらのツールはCookie等を利用して匿名のトラフィックデータを収集します。データの収集を望まない場合は、ブラウザの設定等により無効にできます。",
    ],
  },
  {
    heading: "8. 開示・訂正・削除の請求",
    body: [
      "ご本人から個人情報の開示・訂正・利用停止・削除等のお申し出があった場合は、ご本人であることを確認のうえ、法令に従い速やかに対応します。",
    ],
  },
  {
    heading: "9. お問い合わせ窓口",
    body: [
      `個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。`,
      `${siteConfig.companyName}`,
      `電話番号：${siteConfig.phoneDisplay}`,
    ],
  },
  {
    heading: "10. 改定について",
    body: [
      "本ポリシーの内容は、法令の改正や運用の見直しに応じて、予告なく改定することがあります。改定後の内容は本ページに掲載した時点から適用されます。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "プライバシーポリシー", path: "/privacy" }]} />
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <h1 className="text-3xl font-black text-ink">プライバシーポリシー</h1>
        <p className="mt-4 text-sm text-ink-sub">制定日：2026年7月25日</p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-black text-ink">{section.heading}</h2>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-sub">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
