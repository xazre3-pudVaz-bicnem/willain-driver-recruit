import type { Metadata } from "next";
import Link from "next/link";
import { columnArticles } from "@/content/column";
import { blogJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/Kicker";
import { PageHero } from "@/components/ui/PageHero";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "採用コラム｜軽貨物ドライバーの仕事・報酬・独立の知識",
  description:
    "軽貨物ドライバーの仕事内容・業務委託の仕組み・報酬・週払い・確定申告・独立開業など、これから軽貨物を始める方に役立つ知識を株式会社ウィランがまとめた採用コラムです。",
  alternates: { canonical: "/column" },
  openGraph: {
    title: "採用コラム｜株式会社ウィラン",
    description:
      "軽貨物ドライバーの仕事・契約・お金・独立の知識をまとめた採用コラム。",
    url: "/column",
    type: "website",
  },
};

const categories = [
  "仕事内容",
  "働き方・契約",
  "お金・報酬",
  "独立・キャリア",
] as const;

export default function ColumnIndexPage() {
  return (
    <>
      <JsonLd data={blogJsonLd(columnArticles)} />
      <Breadcrumbs items={[{ name: "採用コラム", path: "/column" }]} />

      <PageHero
        kicker="採用コラム"
        title="知ってから、始める。"
        lead="軽貨物ドライバーという仕事を正しく理解してから応募してほしい。そんな思いから、仕事内容・業務委託の仕組み・お金の知識・独立までの道のりを、わかりやすくまとめました。"
      />

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-16 md:py-24">
        {categories.map((category) => {
          const articles = columnArticles.filter(
            (a) => a.category === category
          );
          if (articles.length === 0) return null;
          return (
            <section key={category}>
              <Kicker animate>{category}</Kicker>
              <div className="border-t border-line">
                {articles.map((article, i) => (
                  <Reveal key={article.slug} delay={Math.min(i * 0.05, 0.2)}>
                    <Link
                      href={`/column/${article.slug}`}
                      className="group block border-b border-line py-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg leading-snug font-black text-ink transition-colors group-hover:text-primary-dark md:text-xl">
                          {article.title}
                        </h3>
                        <svg
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-primary-dark transition-transform group-hover:translate-x-1"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M6 3.5L10.5 8L6 12.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-sub">
                        {article.description}
                      </p>
                      <p className="mt-3 text-xs text-ink-sub">
                        <time dateTime={article.updatedAt}>
                          更新日：{article.updatedAt.replaceAll("-", ".")}
                        </time>
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <CtaSection
        title="読んで納得できたら、応募へ"
        text="コラムで解消しきれない疑問は、面談で直接お答えします。"
        place="column_index"
      />
    </>
  );
}
