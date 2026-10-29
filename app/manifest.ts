import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { recruitRegionsLabel } from "@/lib/jobs";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.brandName,
    description:
      `${recruitRegionsLabel()}で軽貨物ドライバーを募集する株式会社ウィランの採用サイト`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#008F8C",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
