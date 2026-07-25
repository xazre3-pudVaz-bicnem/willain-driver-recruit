"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";
import { MobileNav } from "@/components/layout/MobileNav";

/** 主要ナビ（項目を絞る） */
export const navItems = [
  { href: "/work", label: "仕事内容" },
  { href: "/benefits", label: "働くメリット" },
  { href: "/jobs", label: "募集エリア" },
  { href: "/beginner", label: "未経験の方へ" },
  { href: "/faq", label: "よくある質問" },
] as const;

/**
 * ロゴ。public/images/logo.png を表示し、読み込みに失敗した場合は
 * 会社ブランド名テキストにフォールバックする（画像削除時も404表示を防ぐ）。
 * over-hero時は白抜き表示。
 */
export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`text-xl font-black tracking-tight ${variant === "light" ? "text-white" : "text-primary-dark"} ${className}`}
      >
        {siteConfig.brandName}
      </span>
    );
  }

  return (
    <Image
      src="/images/logo.png"
      alt={siteConfig.companyName}
      width={172}
      height={54}
      priority
      onError={() => setFailed(true)}
      className={`h-7 w-auto md:h-8 ${variant === "light" ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // トップページの最上部のみ透過（ヒーローに重なる）。それ以外は白。
  const overHero = isHome && !scrolled;

  // 透過ヘッダー時、白文字を写真明部でも読めるようにするテキストシャドウ
  const overHeroShadow = overHero
    ? "[text-shadow:0_1px_4px_rgba(5,24,27,0.7)]"
    : "";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero
          ? "bg-transparent"
          : "border-b border-line bg-white/95 backdrop-blur-md"
      }`}
    >
      {/* 透過時の上部スクリム（白文字のコントラスト確保） */}
      {overHero && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-emerald-ink/75 via-emerald-ink/40 to-transparent"
        />
      )}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          aria-label={`${siteConfig.companyName} 採用サイト トップページ`}
        >
          <Logo variant={overHero ? "light" : "dark"} />
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden lg:block">
          <ul
            className={`flex items-center gap-7 text-sm font-bold ${
              overHero ? `text-white ${overHeroShadow}` : "text-ink"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-opacity hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={siteConfig.phoneLink}
            onClick={() => trackEvent("tel_click", { place: "header" })}
            data-event="tel_click"
            className={`hidden text-right leading-tight md:block ${
              overHero ? `text-white ${overHeroShadow}` : "text-ink"
            }`}
            aria-label={`電話で相談する ${siteConfig.phoneDisplay}`}
          >
            <span className="block text-[0.6rem] font-medium opacity-80">
              採用直通
            </span>
            <span className="text-sm font-black tabular-nums">
              {siteConfig.phoneDisplay}
            </span>
          </a>
          <Link
            href="/apply"
            onClick={() => trackEvent("apply_click", { place: "header" })}
            data-event="apply_click"
            className={`hidden rounded-md px-5 py-2.5 text-sm font-bold transition-all md:inline-block ${
              overHero
                ? "bg-white text-primary-dark hover:bg-mint"
                : "bg-primary-dark text-white hover:opacity-90"
            }`}
          >
            応募する
          </Link>
          <MobileNav variant={overHero ? "light" : "dark"} />
        </div>
      </div>
    </header>
  );
}
