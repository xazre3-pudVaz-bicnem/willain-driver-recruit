import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { jobAreas } from "@/lib/jobs";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Logo } from "@/components/layout/Header";

const siteLinks = [
  { href: "/work", label: "仕事内容" },
  { href: "/benefits", label: "ウィランで働くメリット" },
  { href: "/beginner", label: "未経験の方へ" },
  { href: "/independence-support", label: "独立・開業サポート" },
  { href: "/faq", label: "よくある質問" },
  { href: "/column", label: "採用コラム" },
  { href: "/company", label: "会社情報" },
  { href: "/apply", label: "応募フォーム" },
  { href: "/recruitment-policy", label: "求人情報の掲載・更新方針" },
  { href: "/editorial-policy", label: "採用コラムの編集方針" },
  { href: "/privacy", label: "プライバシーポリシー" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-mint/40">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-sub">
              東京・千葉エリアで軽貨物ドライバー（業務委託）を募集しています。日額20,500円〜・週払い対応（いずれも規定あり）・未経験歓迎。
            </p>
            <p className="mt-4 text-sm text-ink-sub">
              採用直通：
              <TrackedLink
                href={siteConfig.phoneLink}
                event="tel_click"
                eventParams={{ place: "footer" }}
                className="font-bold text-primary-dark"
              >
                {siteConfig.phoneDisplay}
              </TrackedLink>
            </p>
            <TrackedLink
              href={siteConfig.instagramUrl}
              event="instagram_click"
              eventParams={{ place: "footer" }}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-primary-dark"
            >
              <InstagramIcon />
              {siteConfig.instagramHandle}
            </TrackedLink>
          </div>

          <nav aria-label="募集エリア">
            <h2 className="mb-4 text-sm font-black tracking-wider text-ink">
              募集エリアから探す
            </h2>
            <ul className="space-y-2.5 text-sm text-ink-sub">
              <li>
                <Link href="/jobs" className="transition-colors hover:text-primary-dark">
                  求人一覧
                </Link>
              </li>
              {jobAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/jobs/${area.slug}`}
                    className="transition-colors hover:text-primary-dark"
                  >
                    {area.areaName}の軽貨物ドライバー求人
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="サイト情報">
            <h2 className="mb-4 text-sm font-black tracking-wider text-ink">
              サイトメニュー
            </h2>
            <ul className="space-y-2.5 text-sm text-ink-sub">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-xs text-ink-sub">
          <p>
            {siteConfig.address.postalCode} {siteConfig.address.full}
          </p>
          <p className="mt-2">
            &copy; {siteConfig.companyName} / {siteConfig.brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
