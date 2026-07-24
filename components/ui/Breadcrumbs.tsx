import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export type Crumb = { name: string; path: string };

/** パンくずリスト（表示 + BreadcrumbList構造化データ） */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "ホーム", path: "/" }, ...items];
  return (
    <nav aria-label="パンくずリスト" className="border-b border-line bg-mint/50">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 overflow-x-auto px-4 py-2.5 text-xs text-ink-sub md:px-6">
        {all.map((item, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={item.path} className="flex shrink-0 items-center gap-1">
              {i > 0 && (
                <svg
                  aria-hidden="true"
                  className="h-3 w-3 text-line"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M4.5 2.5L8 6l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {isLast ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
