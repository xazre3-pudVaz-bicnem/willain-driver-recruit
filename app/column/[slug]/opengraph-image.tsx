import { ImageResponse } from "next/og";
import { columnArticles, getArticle } from "@/content/column";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "採用コラム｜株式会社ウィラン";

export function generateStaticParams() {
  return columnArticles.map((a) => ({ slug: a.slug }));
}

/** 記事ごとの固有OG画像（タイトルとカテゴリを表示） */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? "採用コラム";
  const category = article?.category ?? "軽貨物ドライバー";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#008f8c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            W
          </div>
          <div style={{ color: "#006e6b", fontSize: 26, fontWeight: 700 }}>
            株式会社ウィラン 採用コラム
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              alignSelf: "flex-start",
              background: "#eaf9f8",
              color: "#006e6b",
              fontSize: 26,
              fontWeight: 700,
              padding: "8px 22px",
              borderRadius: 8,
            }}
          >
            {category}
          </div>
          <div
            style={{
              color: "#0d1512",
              fontSize: title.length > 26 ? 52 : 64,
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            borderTop: "4px solid #008f8c",
            paddingTop: 20,
            color: "#4b5563",
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          東京・千葉の軽貨物ドライバー求人 — willain.jp
        </div>
      </div>
    ),
    { ...size }
  );
}
