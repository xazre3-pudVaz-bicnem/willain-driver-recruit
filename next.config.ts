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
};

export default nextConfig;
