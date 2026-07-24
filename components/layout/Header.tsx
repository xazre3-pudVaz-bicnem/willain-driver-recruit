import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { hasPublicFile } from "@/lib/assets";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { MobileNav } from "@/components/layout/MobileNav";

export const navItems = [
  { href: "/jobs", label: "求人一覧" },
  { href: "/work", label: "仕事内容" },
  { href: "/benefits", label: "働くメリット" },
  { href: "/beginner", label: "未経験の方へ" },
  { href: "/independence-support", label: "独立支援" },
  { href: "/faq", label: "よくある質問" },
  { href: "/column", label: "採用コラム" },
  { href: "/company", label: "会社情報" },
] as const;

/** ロゴ。public/images/logo.png（またはlogo.svg）があれば画像を優先する */
export function Logo({ className = "" }: { className?: string }) {
  const logoPng = hasPublicFile("images/logo.png");
  const logoSvg = hasPublicFile("images/logo.svg");
  if (logoPng || logoSvg) {
    return (
      <Image
        src={logoPng ? "/images/logo.png" : "/images/logo.svg"}
        alt={siteConfig.companyName}
        width={172}
        height={54}
        priority
        className={`h-8 w-auto md:h-9 ${className}`}
      />
    );
  }
  return (
    <span className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-xl font-black tracking-tight text-primary">
        {siteConfig.brandName}
      </span>
      <span className="hidden text-[0.65rem] font-medium text-ink-sub sm:inline">
        {siteConfig.companyName}
      </span>
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="shrink-0"
          aria-label={`${siteConfig.companyName} 採用サイト トップページ`}
        >
          <Logo />
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden lg:block">
          <ul className="flex items-center gap-5 text-[0.8rem] font-medium text-ink">
            {navItems.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <TrackedLink
            href={siteConfig.phoneLink}
            event="tel_click"
            eventParams={{ place: "header" }}
            className="hidden items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary md:flex"
            ariaLabel={`電話で相談する ${siteConfig.phoneDisplay}`}
          >
            <PhoneIcon />
            {siteConfig.phoneDisplay}
          </TrackedLink>
          <TrackedLink
            href="/apply"
            event="apply_click"
            eventParams={{ place: "header" }}
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-card transition-colors hover:bg-primary-dark md:inline-block"
          >
            応募する
          </TrackedLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M2.7 3.6c.3-.9 1.2-1.5 2.1-1.3l2 .4c.8.2 1.4.9 1.5 1.7l.3 2c.1.7-.2 1.4-.8 1.8l-1 .8a12.6 12.6 0 0 0 4.2 4.2l.8-1c.4-.6 1.1-.9 1.8-.8l2 .3c.8.1 1.5.7 1.7 1.5l.4 2c.2.9-.4 1.8-1.3 2.1-.9.3-1.9.5-2.9.4A15.5 15.5 0 0 1 2.3 6.5c-.1-1 0-2 .4-2.9Z" />
    </svg>
  );
}
