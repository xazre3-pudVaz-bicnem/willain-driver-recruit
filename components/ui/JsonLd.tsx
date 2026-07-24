import { serializeJsonLd } from "@/lib/jsonld";

/** JSON-LDをXSS対策済みで出力する */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
