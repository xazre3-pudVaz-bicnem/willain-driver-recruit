import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6 md:py-32">
      <p className="text-6xl font-black text-primary/20">404</p>
      <h1 className="mt-4 text-2xl font-black text-ink">
        ページが見つかりませんでした
      </h1>
      <p className="mt-4 leading-relaxed text-ink-sub">
        お探しのページは移動または削除された可能性があります。
        <br />
        以下のリンクからお探しください。
      </p>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-8 py-3.5 font-bold text-white"
        >
          トップページへ戻る
        </Link>
        <Link
          href="/jobs"
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          軽貨物ドライバー求人一覧を見る
        </Link>
      </div>
    </div>
  );
}
