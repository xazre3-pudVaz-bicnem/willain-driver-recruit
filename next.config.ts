import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // URL末尾スラッシュなしで統一（重複URL防止）
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // 親ディレクトリのlockfileを誤検出しないようプロジェクトルートを明示
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      // 非www → www（正式ドメインへ301統一）
      {
        source: "/:path*",
        has: [{ type: "host", value: "willain.jp" }],
        destination: "https://www.willain.jp/:path*",
        permanent: true,
      },
      // 旧Vercelドメイン → 正式ドメイン（検索対象化を防止・envで指定）
      ...(process.env.LEGACY_VERCEL_HOST
        ? [
            {
              source: "/:path*",
              has: [
                { type: "host" as const, value: process.env.LEGACY_VERCEL_HOST },
              ],
              destination: "https://www.willain.jp/:path*",
              permanent: true,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
