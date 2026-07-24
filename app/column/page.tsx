import type { Metadata } from "next";
import Link from "next/link";
import { columnArticles } from "@/content/column";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
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
      <Breadcrumbs items={[{ name: "採用コラム", path: "/column" }]} />

      <div className="bg-gradient-to-b from-mint to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
              Column
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-ink md:text-4xl">
              採用コラム
            </h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-ink-sub">
              軽貨物ドライバーという仕事を正しく理解してから応募してほしい。そんな思いから、仕事内容・業務委託の仕組み・お金の知識・独立までの道のりを、株式会社ウィランがわかりやすくまとめました。
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 md:px-6 md:py-20">
        {categories.map((category) => {
          const articles = columnArticles.filter(
            (a) => a.category === category
          );
          if (articles.length === 0) return null;
          return (
            <section key={category}>
              <Reveal>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-ink">
                  <span
                    aria-hidden="true"
                    className="h-6 w-1.5 rounded-full bg-primary"
                  />
                  {category}
                </h2>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, i) => (
                  <Reveal
                    key={article.slug}
                    delay={(i % 3) * 0.08}
                    className="h-full"
                  >
                    <Link
                      href={`/column/${article.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
                    >
                      <p className="text-xs font-bold text-primary">
                        {article.category}
                      </p>
                      <h3 className="mt-2 leading-snug font-black text-ink group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-sub">
                        {article.description}
                      </p>
                      <p className="mt-4 text-xs text-ink-sub">
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
