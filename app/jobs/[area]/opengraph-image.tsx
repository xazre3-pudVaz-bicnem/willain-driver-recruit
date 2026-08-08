import { ImageResponse } from "next/og";
import { jobAreas, getJobArea } from "@/lib/jobs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "軽貨物ドライバー求人｜株式会社ウィラン";

export function generateStaticParams() {
  return jobAreas.map((a) => ({ area: a.slug }));
}

/** エリアごとの固有OG画像（求人条件を要約） */
export default async function Image({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;
  const area = getJobArea(slug);
  const areaName = area?.areaName ?? "東京・千葉";
  const pay = area?.dailyPayLabel ?? "日額20,500円〜";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(120deg, #05181b 0%, #006e6b 60%, #008f8c 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#008f8c",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            W
          </div>
          <div style={{ color: "#eaf9f8", fontSize: 30, fontWeight: 700 }}>
            WILLAIN 採用
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: "#11aaa5", fontSize: 30, fontWeight: 700 }}>
            軽貨物ドライバー求人（業務委託）
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            {areaName}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {[pay, "週払い可", "未経験歓迎", "車両リースあり"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "2px solid rgba(255,255,255,0.5)",
                borderRadius: 999,
                color: "#fff",
                fontSize: 26,
                fontWeight: 700,
                padding: "10px 26px",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
