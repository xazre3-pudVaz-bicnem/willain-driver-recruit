import { publishedColumnArticles } from "@/content/column";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

/**
 * 採用コラムのRSS 2.0フィード（/feed.xml）。
 * 新規記事の追加で自動的に反映される。ビルド時に静的生成する。
 */
export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** YYYY-MM-DD（JST基準の公開日）→ RFC822 */
function toRfc822(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00+09:00`);
  return d.toUTCString();
}

export function GET(): Response {
  const items = [...publishedColumnArticles]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 30)
    .map((article) => {
      const url = absoluteUrl(`/column/${article.slug}`);
      const author = article.author ?? `${siteConfig.companyName} 採用担当`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.description)}</description>
      <category>${escapeXml(article.category)}</category>
      <dc:creator>${escapeXml(author)}</dc:creator>
      <pubDate>${toRfc822(article.publishedAt)}</pubDate>
    </item>`;
    })
    .join("\n");

  const lastBuild = publishedColumnArticles.length
    ? toRfc822(
        [...publishedColumnArticles].sort((a, b) =>
          a.updatedAt < b.updatedAt ? 1 : -1,
        )[0].updatedAt,
      )
    : toRfc822(siteConfig.siteLastModified.slice(0, 10));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>採用コラム｜${escapeXml(siteConfig.companyName)}</title>
    <link>${absoluteUrl("/column")}</link>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>軽貨物ドライバーの仕事・報酬・契約・独立に関する採用コラム</description>
    <language>ja</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
