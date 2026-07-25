"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

const links = [
  { href: "/", label: "トップページ" },
  { href: "/jobs", label: "募集エリア・求人一覧" },
  { href: "/jobs/shinagawa", label: "品川区の求人", indent: true },
  { href: "/jobs/koto", label: "江東区の求人", indent: true },
  { href: "/jobs/kasai", label: "葛西・江戸川区の求人", indent: true },
  { href: "/jobs/funabashi", label: "船橋市の求人", indent: true },
  { href: "/work", label: "仕事内容" },
  { href: "/benefits", label: "働くメリット" },
  { href: "/beginner", label: "未経験の方へ" },
  { href: "/independence-support", label: "独立・開業サポート" },
  { href: "/faq", label: "よくある質問" },
  { href: "/column", label: "採用コラム" },
  { href: "/company", label: "会社情報" },
];

export function MobileNav({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // 背景スクロールロック
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // フォーカストラップ・Escape・開いた時の初期フォーカス
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')
      ).filter((el) => el.offsetParent !== null);

    getFocusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        const items = getFocusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const barColor = open || variant === "dark" ? "bg-ink" : "bg-white";

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 rounded transition-transform ${barColor} ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`h-0.5 w-6 rounded transition-opacity ${barColor} ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`h-0.5 w-6 rounded transition-transform ${barColor} ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="サイトナビゲーション"
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white"
        >
          <nav aria-label="モバイルナビゲーション" className="px-6 py-6">
            <ul className="divide-y divide-line">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3.5 font-bold text-ink transition-colors hover:text-primary-dark ${
                      link.indent ? "border-l-2 border-line pl-6 text-sm font-medium" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3 pb-24">
              <Link
                href="/apply"
                onClick={() => {
                  setOpen(false);
                  trackEvent("apply_click", { place: "mobile_menu" });
                }}
                data-event="apply_click"
                className="block rounded-md bg-primary-dark py-3.5 text-center font-bold text-white"
              >
                WEBから応募する
              </Link>
              <a
                href={siteConfig.phoneLink}
                onClick={() => trackEvent("tel_click", { place: "mobile_menu" })}
                data-event="tel_click"
                className="block rounded-md border-2 border-primary-dark py-3.5 text-center font-bold text-primary-dark"
              >
                電話で相談する（{siteConfig.phoneDisplay}）
              </a>
              <button
                type="button"
                onClick={closeMenu}
                className="block w-full py-2 text-center text-sm font-medium text-ink-sub"
              >
                閉じる
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
