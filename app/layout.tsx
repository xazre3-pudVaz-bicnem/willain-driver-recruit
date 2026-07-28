import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { organizationJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `東京・千葉の軽貨物ドライバー求人｜${siteConfig.companyName}`,
    template: `%s｜${siteConfig.companyName}`,
  },
  description:
    "東京・品川・江東・葛西・船橋で軽貨物ドライバーを募集する株式会社ウィランの採用サイトです。日額20,000円〜（エリアにより異なる）、週払い対応、未経験歓迎、車両リース・独立支援制度を用意しています。",
  applicationName: siteConfig.siteName,
  formatDetection: { telephone: false },
  openGraph: {
    siteName: siteConfig.siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  ...((process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION)
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
            ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#008F8C",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`no-js ${notoSansJp.variable}`}>
      <head>
        {/* 解析ドメインへの事前接続（設定時のみ・LCP/INPを阻害しない） */}
        {(GA_ID || GTM_ID) && (
          <>
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link
              rel="preconnect"
              href="https://www.googletagmanager.com"
              crossOrigin=""
            />
          </>
        )}
        {GA_ID && (
          <link
            rel="preconnect"
            href="https://www.google-analytics.com"
            crossOrigin=""
          />
        )}
      </head>
      <body className="font-sans antialiased">
        {/* JS有効時にno-jsクラスを外す（リビール表示のフォールバック用） */}
        <Script id="remove-no-js" strategy="beforeInteractive">
          {`document.documentElement.classList.remove('no-js');`}
        </Script>

        {GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
                title="Google Tag Manager"
              />
            </noscript>
          </>
        )}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}

        <JsonLd data={organizationJsonLd()} />

        <Header />
        {/* fixedヘッダー分の余白。トップのヒーローは-mt-16で全面表示にする */}
        <main className="pt-16">{children}</main>
        <Footer />
        <MobileStickyCta />
      </body>
    </html>
  );
}
