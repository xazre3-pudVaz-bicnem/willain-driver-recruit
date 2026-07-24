import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { columnArticles, getArticle, getRelatedArticles } from "@/content/column";
import type { ColumnBlock } from "@/lib/column";
import { siteConfig } from "@/lib/site-config";
import { articleJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/job/CtaSection";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return columnArticles.map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/column/${article.slug}` },
    openGraph: {
      title: `${article.title}｜${siteConfig.companyName}`,
      description: article.description,
      url: `/column/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

function Block({ block }: { block: ColumnBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-12 mb-4 border-l-4 border-primary pl-4 text-2xl leading-snug font-black text-ink">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 mb-3 text-lg font-black text-ink">{block.text}</h3>
      );
    case "p":
      return <p className="my-4 leading-loose text-ink-sub">{block.text}</p>;
    case "ul":
      return (
        <ul className="my-4 space-y-2 rounded-xl bg-mint/60 px-6 py-5">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 leading-relaxed text-ink-sub">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-4 list-decimal space-y-2 rounded-xl bg-mint/60 py-5 pr-6 pl-11 leading-relaxed text-ink-sub marker:font-bold marker:text-primary">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <div className="my-5 rounded-xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-ink-sub">
          {block.text}
        </div>
      );
    case "cta":
      return (
        <div className="my-6 rounded-2xl border-2 border-primary/30 bg-mint px-6 py-5">
          {block.text && (
            <p className="mb-2 text-sm leading-relaxed text-ink-sub">
              {block.text}
            </p>
          )}
          <Link
            href={block.href}
            className="inline-flex items-center gap-1 font-black text-primary underline-offset-4 hover:underline"
          >
            {block.label}
            <svg
              aria-hidden="true"
              className="h-4 w-4"
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
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default async function ColumnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.description,
          path: `/column/${article.slug}`,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "採用コラム", path: "/column" },
          { name: article.title, path: `/column/${article.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <header>
          <p className="text-xs font-bold text-primary">{article.category}</p>
          <h1 className="mt-3 text-3xl leading-snug font-black text-ink md:text-[2.2rem]">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-sub">
            <p>
              公開日：
              <time dateTime={article.publishedAt}>
                {article.publishedAt.replaceAll("-", ".")}
              </time>
            </p>
            <p>
              更新日：
              <time dateTime={article.updatedAt}>
                {article.updatedAt.replaceAll("-", ".")}
              </time>
            </p>
            <p>執筆・監修：{siteConfig.companyName} 採用担当</p>
          </div>
        </header>

        <div className="mt-8">
          {article.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <footer className="mt-12 rounded-2xl bg-mint/60 px-6 py-5 text-sm leading-relaxed text-ink-sub">
          <p className="font-bold text-ink">この記事の運営者</p>
          <p className="mt-1">
            {siteConfig.companyName}（{siteConfig.brandName}）／東京・千葉エリアの軽貨物配送事業。品川区・江東区・江戸川区葛西エリア・船橋市で軽貨物ドライバー（業務委託）を募集しています。
          </p>
        </footer>
      </article>

      {/* 関連記事 */}
      {related.length > 0 && (
        <section className="border-t border-line bg-mint/40 py-14">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="mb-6 text-xl font-black text-ink">関連記事</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/column/${rel.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary"
                >
                  <p className="text-xs font-bold text-primary">
                    {rel.category}
                  </p>
                  <h3 className="mt-2 leading-snug font-black text-ink group-hover:text-primary">
                    {rel.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-sub">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
            <p className="mt-8 text-center">
              <Link
                href="/column"
                className="font-bold text-primary underline-offset-4 hover:underline"
              >
                採用コラム一覧へ戻る
              </Link>
            </p>
          </div>
        </section>
      )}

      <CtaSection place={`column_${article.slug}`} />
    </>
  );
}
