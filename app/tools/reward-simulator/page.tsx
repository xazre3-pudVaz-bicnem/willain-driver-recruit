import type { Metadata } from "next";
import Link from "next/link";
import { getActiveAreas, jobCommon } from "@/lib/jobs";
import { webPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { RewardSimulator, type AreaPreset } from "@/components/tools/RewardSimulator";

export const metadata: Metadata = {
  title: "軽貨物ドライバーの報酬・経費シミュレーター",
  description:
    "軽貨物ドライバー（業務委託）の月額報酬の額面から、車両リース・ガソリン・駐車場などの経費を引いた参考値を計算できます。日額や稼働日数を入力して、経費控除前の残額の目安を確認できます。",
  alternates: { canonical: "/tools/reward-simulator" },
  openGraph: {
    title: "軽貨物ドライバーの報酬・経費シミュレーター｜株式会社ウィラン",
    description:
      "日額・稼働日数・経費を入力し、経費控除前の残額の目安を計算。手取りではなく参考値です。",
    url: "/tools/reward-simulator",
    type: "website",
  },
};

const staticSections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "額面と手取りの違い",
    body: (
      <>
        <p>
          「日額×稼働日数」で計算できるのは、報酬の<strong>額面</strong>です。
          業務委託の軽貨物ドライバーは個人事業主にあたるため、ここから車両やガソリンなどの経費を自分で負担し、
          さらに所得税・住民税・国民健康保険・国民年金などを別に納めます。
        </p>
        <p className="mt-3">
          このシミュレーターが示すのは、額面から入力した経費を引いた
          <strong>「税金・社会保険を引く前の残額」</strong>です。会社員の給与の手取りとは計算が異なり、
          実際の手取りはさらに少なくなります。正確な税額は、収入や控除によって一人ひとり変わります。
        </p>
      </>
    ),
  },
  {
    heading: "業務委託で発生する主な経費",
    body: (
      <ul className="ml-5 list-disc space-y-1.5">
        <li>車両費（リース料または自己所有車の維持費）</li>
        <li>ガソリン代</li>
        <li>駐車場代</li>
        <li>任意保険・貨物保険などの保険料</li>
        <li>車検・整備・タイヤなどの整備費（積み立てておくと安心）</li>
        <li>スマートフォン通信費・備品などのその他経費</li>
      </ul>
    ),
  },
  {
    heading: "日額を見るときの注意点",
    body: (
      <p>
        日額保証は、配達件数に関わらず1日あたりの報酬を保証する仕組みですが、規定があります。
        月額の見通しは稼働日数で大きく変わり、経費の額によって手元に残る額も変わります。
        日額の大小だけでなく、経費・稼働日数・支払いサイクルをあわせて比較することが大切です。
      </p>
    ),
  },
  {
    heading: "車両リースと持ち込みの違い",
    body: (
      <p>
        車を持っていない場合は、月額{jobCommon.leasePrice.replace("月額", "")}
        の車両リースを利用できます（契約条件あり）。自分の軽バンを持ち込む場合はリース料はかかりませんが、
        維持費や整備費は自己負担です。シミュレーターの「車両リース料」を持ち込みの場合は0円にして比較してください。
      </p>
    ),
  },
  {
    heading: "税務上の注意",
    body: (
      <p>
        経費として認められる範囲や、確定申告・青色申告の要件は、状況によって異なります。
        このページの計算は概算の参考であり、税務上の判断ではありません。具体的な取り扱いは、
        国税庁の情報や税理士へご確認ください。株式会社ウィランでは、確定申告の相談や税理士の紹介にも対応しています。
      </p>
    ),
  },
];

export default function RewardSimulatorPage() {
  const areas = getActiveAreas();
  const presets: AreaPreset[] = areas.map((a) => ({
    slug: a.slug,
    shortName: a.shortName,
    dailyPay: a.dailyPay,
    dailyPayLabel: a.dailyPayLabel,
  }));

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: "軽貨物ドライバーの報酬・経費シミュレーター",
          path: "/tools/reward-simulator",
          image: "/images/photos/app-scan.webp",
        })}
      />
      <Breadcrumbs
        items={[
          { name: "報酬・経費シミュレーター", path: "/tools/reward-simulator" },
        ]}
      />
      <PageHero
        kicker="報酬・経費シミュレーター"
        title="日額から、残る額を試算する。"
        lead="日額と稼働日数、毎月の経費を入力すると、税金・社会保険を引く前の残額の目安を確認できます。手取りや保証額ではなく、あくまで参考値です。"
      />

      <section className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        <RewardSimulator areas={presets} leaseDefault={jobCommon.leasePriceValue} />
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl space-y-12 px-6 py-16 md:py-20">
          {staticSections.map((s) => (
            <div key={s.heading}>
              <Kicker>{s.heading}</Kicker>
              <div className="mt-2 text-[1.0625rem] leading-[1.9] text-ink-sub">
                {s.body}
              </div>
            </div>
          ))}

          <div className="border-t border-line pt-8">
            <p className="text-sm font-bold text-ink">関連ページ</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { href: "/benefits", t: "日額保証・週払い・車両リースを確認する" },
                { href: "/jobs", t: "東京・千葉の軽貨物ドライバー求人一覧を見る" },
                { href: "/column/take-home-and-expenses", t: "手取りと経費の考え方を読む" },
                { href: "/column/gasoline-cost", t: "ガソリン代の考え方を読む" },
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
      </section>
    </>
  );
}
