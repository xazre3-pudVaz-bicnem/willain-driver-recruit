import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 送信完了ページはnoindex＋クロール不要
        disallow: ["/apply/thanks"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
