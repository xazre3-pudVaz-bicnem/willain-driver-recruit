import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { jobCommon, buildJobDescriptionText, type JobArea } from "@/lib/jobs";

/**
 * JSON-LDをXSS対策済みの文字列に変換する。
 * `<` をエスケープすることで `</script>` 挿入による攻撃を防ぐ。
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * Organization（全ページ共通・layoutで出力）
 * ※常設営業所か登記住所のみか未確認のため LocalBusiness は使わない。
 *   採用の連絡先として contactPoint（recruiter）を明示する。
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.companyName,
    alternateName: siteConfig.brandName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl("/icons/icon.svg"),
    telephone: siteConfig.phoneE164,
    address: {
      "@type": "PostalAddress",
      postalCode: siteConfig.address.postalCode.replace("〒", ""),
      addressRegion: siteConfig.address.region,
      addressLocality: siteConfig.address.locality,
      streetAddress: siteConfig.address.street,
      addressCountry: "JP",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "recruitment",
        telephone: siteConfig.phoneE164,
        areaServed: "JP",
        availableLanguage: ["ja"],
      },
    ],
    sameAs: [siteConfig.instagramUrl],
  };
}

/**
 * ItemList（求人一覧ページ用）。個別求人へのリンク集であり JobPosting は付けない。
 * 各エリア求人詳細を position 付きで列挙する。
 */
export function jobsItemListJsonLd(
  areas: { areaName: string; slug: string; dailyPayLabel: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "軽貨物ドライバー求人一覧",
    itemListElement: areas.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${a.areaName}の軽貨物ドライバー求人（${a.dailyPayLabel}）`,
      url: absoluteUrl(`/jobs/${a.slug}`),
    })),
  };
}

/** WebSite（トップページで出力） */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    inLanguage: "ja",
    publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
  };
}

/** パンくずリスト */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQPage */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * JobPosting（エリア別求人詳細ページ専用。求人一覧には付けない）
 * - title には職種名のみ（会社名・勤務地・報酬・記号を入れない）
 * - description は画面表示と同一データから生成
 * - datePosted は実際の初回公開日（ビルド日で自動更新しない）
 * - validThrough は area.validThrough がある場合のみ出力（未定なら付けない）
 * - directApply はサイト内フォームから直接応募できるため true
 */
export function jobPostingJsonLd(area: JobArea) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: jobCommon.title,
    description: buildJobDescriptionText(area)
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join(""),
    identifier: {
      "@type": "PropertyValue",
      name: siteConfig.companyName,
      value: area.identifier,
    },
    datePosted: area.datePosted,
    ...(area.validThrough ? { validThrough: area.validThrough } : {}),
    employmentType: jobCommon.employmentTypeSchema,
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.companyName,
      sameAs: siteConfig.siteUrl,
      logo: absoluteUrl("/icons/icon.svg"),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: area.addressLocality,
        addressRegion: area.addressRegion,
        addressCountry: "JP",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: jobCommon.baseSalaryCurrency,
      value: {
        "@type": "QuantitativeValue",
        // エリアごとの日額保証（下限）。画面表示の dailyPayLabel と一致させる。
        value: area.dailyPay,
        unitText: jobCommon.baseSalaryUnit,
      },
    },
    directApply: true,
  };
}

/**
 * BlogPosting（採用コラム記事）。
 * image・mainEntityOfPage・author(組織)・publisher を含める。
 */
export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    inLanguage: "ja",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    image: absoluteUrl(input.image ?? "/opengraph-image"),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: {
      "@type": "Organization",
      name: `${siteConfig.companyName} 採用担当`,
      url: absoluteUrl("/recruitment-policy"),
    },
    publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
  };
}
