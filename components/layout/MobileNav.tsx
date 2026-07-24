"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

const links = [
  { href: "/", label: "トップページ" },
  { href: "/jobs", label: "求人一覧" },
  { href: "/jobs/shinagawa", label: "品川区の求人", indent: true },
  { href: "/jobs/koto", label: "江東区の求人", indent: true },
  { href: "/jobs/kasai", label: "葛西・江戸川区の求人", indent: true },
  { href: "/jobs/funabashi", label: "船橋市の求人", indent: true },
  { href: "/work", label: "仕事内容" },
  { href: "/benefits", label: "ウィランで働くメリット" },
  { href: "/beginner", label: "未経験の方へ" },
  { href: "/independence-support", label: "独立・開業サポート" },
  { href: "/faq", label: "よくある質問" },
  { href: "/column", label: "採用コラム" },
  { href: "/company", label: "会社情報" },
  { href: "/apply", label: "応募フォーム" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // メニュー表示中は背景スクロールを止める
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg"
      >
        <span
          className={`h-0.5 w-6 rounded bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`h-0.5 w-6 rounded bg-ink transition-opacity ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`h-0.5 w-6 rounded bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-white"
        >
          <nav aria-label="モバイルナビゲーション" className="px-6 py-6">
            <ul className="divide-y divide-line">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3.5 font-medium text-ink transition-colors hover:text-primary ${
                      link.indent ? "border-l-2 border-line pl-6 text-sm" : ""
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
                className="block rounded-full bg-primary py-3.5 text-center font-bold text-white"
              >
                60秒で応募する
              </Link>
              <a
                href={siteConfig.phoneLink}
                onClick={() => trackEvent("tel_click", { place: "mobile_menu" })}
                data-event="tel_click"
                className="block rounded-full border-2 border-primary py-3.5 text-center font-bold text-primary"
              >
                電話で相談する（{siteConfig.phoneDisplay}）
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("instagram_click", { place: "mobile_menu" })
                }
                data-event="instagram_click"
                className="block rounded-full border border-line py-3.5 text-center font-bold text-ink"
              >
                Instagramを見る
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
