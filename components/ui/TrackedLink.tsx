"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type TrackEventName } from "@/lib/analytics";

type Props = {
  href: string;
  event: TrackEventName;
  eventParams?: Record<string, string | number | undefined>;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

/**
 * クリック計測付きリンク。
 * tel: / 外部URLは<a>、内部リンクはnext/linkで描画する。
 * data-event属性はGTMのクリックトリガーでも利用できる。
 */
export function TrackedLink({
  href,
  event,
  eventParams,
  className,
  children,
  ariaLabel,
}: Props) {
  const handleClick = () => trackEvent(event, eventParams);
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link
        href={href}
        className={className}
        onClick={handleClick}
        data-event={event}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  const isExternalHttp = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      data-event={event}
      aria-label={ariaLabel}
      {...(isExternalHttp
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
