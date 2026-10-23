import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { TrackedLink } from "@/components/ui/TrackedLink";

/**
 * 協力会社・パートナー募集の送信完了ページ。検索結果に出す必要がないためnoindexにする。
 * ドライバー応募のCV（apply_submit / form_submit）と混ざらないよう、完了イベントは送らない。
 * 完了数はこのページの page_view（/partner/thanks）で計測する。
 */
export const metadata: Metadata = {
  title: "お問い合わせを受け付けました",
  robots: { index: false, follow: false },
};

export default function PartnerThanksPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6 md:py-28">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint"
      >
        <svg className="h-8 w-8 text-primary-dark" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-black text-ink">
        お問い合わせを受け付けました
      </h1>
      <p className="mt-4 leading-relaxed text-ink-sub">
        お問い合わせありがとうございます。内容を確認のうえ、担当者よりお電話またはメールでご連絡します。
        <br />
        しばらく経っても連絡がない場合は、お手数ですがお電話にてお問い合わせください。
      </p>
      <div className="mt-8 space-y-3">
        <TrackedLink
          href={siteConfig.phoneLink}
          event="tel_click"
          eventParams={{ place: "partner_thanks" }}
          className="inline-block rounded-full border-2 border-primary px-8 py-3.5 font-bold text-primary-dark"
          ariaLabel={`電話で問い合わせる ${siteConfig.phoneDisplay}`}
        >
          {siteConfig.phoneDisplay}
        </TrackedLink>
        <p>
          <Link
            href="/partner"
            className="text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
          >
            協力会社・パートナー募集のページへ戻る
          </Link>
        </p>
        <p>
          <Link
            href="/"
            className="text-sm text-ink-sub underline-offset-4 hover:underline"
          >
            トップページへ戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
