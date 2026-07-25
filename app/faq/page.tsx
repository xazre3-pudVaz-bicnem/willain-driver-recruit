import type { Metadata } from "next";
import { faqCategories, allFaqItems } from "@/lib/faq";
import { faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "よくある質問｜報酬・週払い・未経験・車両リース",
  description:
    "株式会社ウィランの軽貨物ドライバー求人に関するよくある質問をまとめました。報酬・週払い・勤務日数・車両リース・未経験からのスタート・独立支援について、採用担当が回答します。",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "よくある質問｜株式会社ウィラン",
    description:
      "軽貨物ドライバー求人に関する質問に採用担当が回答。報酬・週払い・車両・未経験・独立支援など。",
    url: "/faq",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqItems())} />
      <Breadcrumbs items={[{ name: "よくある質問", path: "/faq" }]} />

      <PageHero
        kicker="よくある質問"
        title="応募の前に。"
        lead="応募前に多く寄せられる質問をまとめました。ここにない疑問は、応募フォームの相談欄またはお電話（080-7297-3908）でお気軽にお尋ねください。"
      />

      <div className="mx-auto max-w-3xl space-y-14 px-6 py-16 md:py-24">
        {faqCategories.map((category, i) => (
          <section key={category.category}>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-ink md:text-2xl">
              <span aria-hidden="true" className="h-5 w-1 bg-primary-dark" />
              {category.category}
            </h2>
            <FaqAccordion items={category.items} defaultOpenFirst={i === 0} />
          </section>
        ))}
      </div>

      <CtaSection
        title="疑問が解消したら、次の一歩へ"
        text="面談では、ここに書ききれない細かな条件も確認できます。応募は60秒で完了します。"
        place="faq"
      />
    </>
  );
}
