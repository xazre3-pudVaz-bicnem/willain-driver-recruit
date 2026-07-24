"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

/**
 * スマートフォン用の画面下部追従CTA。
 * 応募フォーム系ページでは非表示。safe-area対応・コンテンツを隠さないよう
 * body側にpadding-bottomを付与する（globals.cssの.has-sticky-cta）。
 */
export function MobileStickyCta() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/apply");

  useEffect(() => {
    document.body.classList.toggle("has-sticky-cta", !hidden);
    return () => document.body.classList.remove("has-sticky-cta");
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
        <a
          href={siteConfig.phoneLink}
          onClick={() => trackEvent("tel_click", { place: "sticky_cta" })}
          data-event="tel_click"
          className="flex items-center justify-center gap-1.5 rounded-full border-2 border-primary py-3 text-sm font-bold text-primary"
          aria-label={`電話で相談する ${siteConfig.phoneDisplay}`}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.7 3.6c.3-.9 1.2-1.5 2.1-1.3l2 .4c.8.2 1.4.9 1.5 1.7l.3 2c.1.7-.2 1.4-.8 1.8l-1 .8a12.6 12.6 0 0 0 4.2 4.2l.8-1c.4-.6 1.1-.9 1.8-.8l2 .3c.8.1 1.5.7 1.7 1.5l.4 2c.2.9-.4 1.8-1.3 2.1-.9.3-1.9.5-2.9.4A15.5 15.5 0 0 1 2.3 6.5c-.1-1 0-2 .4-2.9Z" />
          </svg>
          電話で相談
        </a>
        <Link
          href="/apply"
          onClick={() => trackEvent("apply_click", { place: "sticky_cta" })}
          data-event="apply_click"
          className="flex items-center justify-center rounded-full bg-primary py-3 text-sm font-bold text-white shadow-card"
        >
          WEB応募（60秒）
        </Link>
      </div>
    </div>
  );
}
