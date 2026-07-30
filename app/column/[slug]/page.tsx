import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  publishedColumnArticles,
  getArticle,
  getRelatedArticles,
} from "@/content/column";
import type { ColumnBlock } from "@/lib/column";
import { siteConfig } from "@/lib/site-config";
import { articleJsonLd, webPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/job/CtaSection";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedColumnArticles.map((article) => ({ slug: article.slug }));
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

function Block({ block, id }: { block: ColumnBlock; id?: string }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={id}
          className="mt-12 mb-4 scroll-mt-24 border-l-4 border-primary pl-4 text-2xl leading-snug font-black text-ink"
        >
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
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-dark"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-4 list-decimal space-y-2 rounded-xl bg-mint/60 py-5 pr-6 pl-11 leading-relaxed text-ink-sub marker:font-bold marker:text-primary-dark">
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
            className="inline-flex items-center gap-1 font-black text-primary-dark underline-offset-4 hover:underline"
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
    case "sources":
      return (
        <ul className="my-5 space-y-2 rounded-xl border border-line bg-white px-6 py-5 text-sm">
          {block.items.map((source) => (
            <li key={source.url} className="leading-relaxed">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary-dark underline underline-offset-2"
              >
                {source.name}
              </a>
              <span className="ml-2 text-xs text-ink-sub">
                （確認日：{source.checkedDate.replaceAll("-", ".")}）
              </span>
            </li>
          ))}
        </ul>
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

  // 目次（H2見出しから生成）
  const headings = article.blocks
    .map((b, i) => (b.type === "h2" ? { text: b.text, id: `h-${i}` } : null))
    .filter((h): h is { text: string; id: string } => h !== null);

  // 著者表示：人間が確認した場合のみ「採用担当が確認」と表示（実態と一致させる）
  const reviewed = article.humanReviewed === true;
  const aiAssisted = article.generatedWithAI === true;
  const authorName = reviewed
    ? `${siteConfig.companyName} 採用担当`
    : aiAssisted
      ? `${siteConfig.companyName} 編集部`
      : `${siteConfig.companyName} 採用担当`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.description,
          path: `/column/${article.slug}`,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
          image: article.image ?? `/column/${article.slug}/opengraph-image`,
          section: article.category,
          keywords: [
            ...(article.mainKeyword ? [article.mainKeyword] : []),
            ...(article.subKeywords ?? []),
          ],
          authorName,
        })}
      />
      <JsonLd
        data={webPageJsonLd({
          title: article.title,
          path: `/column/${article.slug}`,
          image: `/column/${article.slug}/opengraph-image`,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
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
          <p className="text-xs font-bold text-primary-dark">{article.category}</p>
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
            <p>
              {reviewed ? "確認" : aiAssisted ? "編集" : "編集・確認"}：
              <Link
                href="/editorial-policy"
                className="font-bold text-primary-dark underline underline-offset-2"
              >
                {authorName}
              </Link>
              {reviewed && article.reviewedAt ? (
                <span className="ml-1">（{article.reviewedAt.replaceAll("-", ".")}確認）</span>
              ) : null}
            </p>
          </div>
          {aiAssisted && !reviewed && (
            <p className="mt-3 rounded-lg bg-mint/50 px-4 py-2.5 text-xs leading-relaxed text-ink-sub">
              この記事は、承認済みの求人データと公式情報をもとに、AIを補助的に利用して作成しています（担当者による内容確認前の記事です）。制度・数値は各
              <Link href="/editorial-policy" className="font-bold text-primary-dark underline underline-offset-2">
                編集方針
              </Link>
              の出典・公的機関をご確認ください。
            </p>
          )}
        </header>

        {headings.length >= 3 && (
          <nav
            aria-label="目次"
            className="mt-8 rounded-2xl border border-line bg-paper px-6 py-5"
          >
            <p className="text-sm font-black text-ink">目次</p>
            <ol className="mt-3 space-y-1.5 text-sm text-ink-sub">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="underline-offset-2 hover:text-primary-dark hover:underline"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {article.image && (
          <figure className="mt-8 overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt={article.imageAlt ?? `${article.title}のイメージ`}
              width={1200}
              height={630}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full object-cover"
              priority
            />
          </figure>
        )}

        <div className="mt-8">
          {article.blocks.map((block, i) => (
            <Block
              key={i}
              block={block}
              id={block.type === "h2" ? `h-${i}` : undefined}
            />
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
                  <p className="text-xs font-bold text-primary-dark">
                    {rel.category}
                  </p>
                  <h3 className="mt-2 leading-snug font-black text-ink group-hover:text-primary-dark">
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
                className="font-bold text-primary-dark underline-offset-4 hover:underline"
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
