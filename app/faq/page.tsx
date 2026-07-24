import type { Metadata } from "next";
import { faqCategories, allFaqItems } from "@/lib/faq";
import { faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
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

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              FAQ
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              よくある質問
            </h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-ink-sub">
              応募前に多く寄せられる質問をまとめました。ここにない疑問は、応募フォームの相談欄またはお電話（080-7297-3908）でお気軽にお尋ねください。
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-14 md:px-6 md:py-20">
        {faqCategories.map((category) => (
          <section key={category.category}>
            <Reveal>
              <h2 className="mb-5 flex items-center gap-3 text-xl font-black text-ink">
                <span
                  aria-hidden="true"
                  className="h-6 w-1.5 rounded-full bg-primary"
                />
                {category.category}
              </h2>
            </Reveal>
            <FaqAccordion items={category.items} />
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
