"use client";

import { useState } from "react";

/**
 * Googleマップの埋め込み。初期表示では読み込まず、ボタンを押したときだけ iframe を読み込む
 * （第三者Cookieと読み込み負荷で Core Web Vitals・Lighthouse を落とさないため）。
 * 表示するのは公開してよい範囲の地図（多くの拠点は町名まで。番地まで公開している拠点はその住所）。
 */
export function MapEmbed({ query, title }: { query: string; title: string }) {
  const [open, setOpen] = useState(false);
  const q = encodeURIComponent(query);

  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="relative aspect-[4/3] w-full">
        {open ? (
          <iframe
            title={title}
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-mint/60 px-6 text-center transition-colors hover:bg-mint"
          >
            <svg aria-hidden="true" className="h-9 w-9 text-primary-dark" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <span className="font-black text-ink">{query}</span>
            <span className="text-sm font-bold text-primary-dark underline-offset-4 group-hover:underline">
              地図を表示する（Googleマップ）
            </span>
          </button>
        )}
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm font-bold text-primary-dark hover:underline"
      >
        Googleマップで開く
        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 3.5L10.5 8L6 12.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
