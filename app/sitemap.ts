import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { getActiveAreas } from "@/lib/jobs";
import { publishedColumnArticles } from "@/content/column";
import { partnerPageUpdatedAt } from "@/lib/partner";

/**
 * sitemap.xml。
 * lastmodはビルド日時ではなく、データ上の更新日（手動管理）を使用する。
 * /apply/thanks はnoindex・募集終了エリアは含めない。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // ページごとの実際の更新日（site-config の pageLastModified）。未登録ならサイト全体の更新日
  const lastMod = (path: string) =>
    new Date(siteConfig.pageLastModified[path] ?? siteConfig.siteLastModified);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: lastMod("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/jobs"), lastModified: lastMod("/jobs"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/work"), lastModified: lastMod("/work"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/benefits"), lastModified: lastMod("/benefits"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/beginner"), lastModified: lastMod("/beginner"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/independence-support"), lastModified: lastMod("/independence-support"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/partner"), lastModified: new Date(partnerPageUpdatedAt), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/faq"), lastModified: lastMod("/faq"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/glossary"), lastModified: lastMod("/glossary"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/tools/reward-simulator"), lastModified: lastMod("/tools/reward-simulator"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/company"), lastModified: lastMod("/company"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/apply"), lastModified: lastMod("/apply"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/recruitment-policy"), lastModified: lastMod("/recruitment-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/editorial-policy"), lastModified: lastMod("/editorial-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: lastMod("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/column"), lastModified: lastMod("/column"), changeFrequency: "weekly", priority: 0.7 },
  ];

  const jobPages: MetadataRoute.Sitemap = getActiveAreas().map((area) => ({
    url: absoluteUrl(`/jobs/${area.slug}`),
    lastModified: new Date(area.dateModified),
    changeFrequency: "weekly",
    priority: 0.9,
    // 画像サイトマップ：エリア代表画像
    images: [absoluteUrl(area.image)],
  }));

  const columnPages: MetadataRoute.Sitemap = publishedColumnArticles.map(
    (article) => ({
      url: absoluteUrl(`/column/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
      // 記事の固有OG画像（アイキャッチ写真があればそれも含める）
      images: [
        absoluteUrl(`/column/${article.slug}/opengraph-image`),
        ...(article.image ? [absoluteUrl(article.image)] : []),
      ],
    }),
  );

  // コラムのカテゴリーハブ（記事3本以上のカテゴリーのみ）
  const categoryDefs: { slug: string; category: string }[] = [
    { slug: "work", category: "仕事内容" },
    { slug: "contract", category: "働き方・契約" },
    { slug: "money", category: "お金・報酬" },
    { slug: "independence", category: "独立・キャリア" },
  ];
  const categoryPages: MetadataRoute.Sitemap = categoryDefs
    .filter(
      (d) =>
        publishedColumnArticles.filter((a) => a.category === d.category).length >=
        3,
    )
    .map((d) => ({
      url: absoluteUrl(`/column/category/${d.slug}`),
      lastModified: lastMod("/column/category"),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  // トップのヒーロー画像も画像サイトマップに含める
  const home = staticPages.find((p) => p.url === absoluteUrl("/"));
  if (home) home.images = [absoluteUrl("/images/hero-driver.webp")];

  return [...staticPages, ...jobPages, ...categoryPages, ...columnPages];
}
