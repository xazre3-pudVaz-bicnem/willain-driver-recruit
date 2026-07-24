import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ApplyForm } from "@/components/forms/ApplyForm";

export const metadata: Metadata = {
  title: "応募フォーム（60秒で完了）",
  description:
    "株式会社ウィランの軽貨物ドライバー応募フォームです。品川・江東・葛西・船橋エリアの業務委託ドライバーに60秒で応募できます。未経験歓迎・日額21,000円保証・週払い可。",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "軽貨物ドライバー応募フォーム｜株式会社ウィラン",
    description:
      "東京・千葉の軽貨物ドライバー求人に60秒で応募。未経験歓迎・日額21,000円保証。",
    url: "/apply",
    type: "website",
  },
};

export default function ApplyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "応募フォーム", path: "/apply" }]} />
      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center md:px-6 md:py-16">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Entry
            </p>
            <h1 className="mt-3 text-3xl font-black text-ink md:text-4xl">
              応募フォーム
            </h1>
            <p className="mt-4 leading-relaxed text-ink-sub">
              入力は約60秒で完了します。「まず話を聞いてみたい」という段階のご相談も歓迎です。
              <br />
              内容を確認のうえ、担当者からご連絡します。
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 md:px-6 md:pb-24">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card md:p-10">
          <Suspense fallback={null}>
            <ApplyForm />
          </Suspense>
        </div>

        <div className="mt-8 rounded-2xl bg-mint px-6 py-5 text-center">
          <p className="text-sm font-bold text-ink">
            お電話でのご相談はこちら
          </p>
          <TrackedLink
            href={siteConfig.phoneLink}
            event="tel_click"
            eventParams={{ place: "apply_page" }}
            className="mt-1 inline-block text-2xl font-black text-primary tabular-nums"
            ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
          >
            {siteConfig.phoneDisplay}
          </TrackedLink>
          <p className="mt-1 text-xs text-ink-sub">
            採用担当直通｜{siteConfig.phoneNote}
          </p>
        </div>
      </div>
    </>
  );
}
