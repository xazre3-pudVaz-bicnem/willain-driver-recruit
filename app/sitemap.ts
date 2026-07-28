import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { getActiveAreas } from "@/lib/jobs";
import { columnArticles } from "@/content/column";

/**
 * sitemap.xml。
 * lastmodはビルド日時ではなく、データ上の更新日（手動管理）を使用する。
 * /apply/thanks はnoindex・募集終了エリアは含めない。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteLastMod = new Date(siteConfig.siteLastModified);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: siteLastMod, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/jobs"), lastModified: siteLastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/work"), lastModified: siteLastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/benefits"), lastModified: siteLastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/beginner"), lastModified: siteLastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/independence-support"), lastModified: siteLastMod, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/faq"), lastModified: siteLastMod, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/company"), lastModified: siteLastMod, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/apply"), lastModified: siteLastMod, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/recruitment-policy"), lastModified: siteLastMod, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/editorial-policy"), lastModified: siteLastMod, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: siteLastMod, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/column"), lastModified: siteLastMod, changeFrequency: "weekly", priority: 0.7 },
  ];

  const jobPages: MetadataRoute.Sitemap = getActiveAreas().map((area) => ({
    url: absoluteUrl(`/jobs/${area.slug}`),
    lastModified: new Date(area.dateModified),
    changeFrequency: "weekly",
    priority: 0.9,
    // 画像サイトマップ：エリア代表画像
    images: [absoluteUrl(area.image)],
  }));

  const columnPages: MetadataRoute.Sitemap = columnArticles.map((article) => ({
    url: absoluteUrl(`/column/${article.slug}`),
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
    // 記事の固有OG画像
    images: [absoluteUrl(`/column/${article.slug}/opengraph-image`)],
  }));

  // トップのヒーロー画像も画像サイトマップに含める
  const home = staticPages.find((p) => p.url === absoluteUrl("/"));
  if (home) home.images = [absoluteUrl("/images/hero-driver.webp")];

  return [...staticPages, ...jobPages, ...columnPages];
}
