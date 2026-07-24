import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Willain - 株式会社ウィラン 軽貨物ドライバー採用サイト";

/**
 * OGP画像（全ページ共通のフォールバック）。
 * ImageResponseの標準フォントは日本語グリフを含まないため英字表記で構成。
 * 日本語入りのデザイン画像を用意する場合は public/ に配置し、
 * 各ページのopenGraph.imagesで差し替える。
 */
export default function OpengraphImage() {
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
            "linear-gradient(120deg, #006E6B 0%, #008F8C 55%, #11AAA5 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#008F8C",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            W
          </div>
          <div style={{ color: "#EAF9F8", fontSize: 34, fontWeight: 700 }}>
            WILLAIN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            DRIVER RECRUIT
          </div>
          <div style={{ color: "#EAF9F8", fontSize: 34, fontWeight: 500 }}>
            TOKYO / CHIBA - LIGHT CARGO DELIVERY
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["21,000 JPY / DAY", "WEEKLY PAY", "NO EXPERIENCE OK"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.14)",
                  border: "2px solid rgba(255,255,255,0.5)",
                  borderRadius: 999,
                  color: "#ffffff",
                  fontSize: 26,
                  fontWeight: 700,
                  padding: "12px 28px",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
