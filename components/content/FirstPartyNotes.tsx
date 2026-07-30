import { getFirstPartySection } from "@/data/first-party-content";
import { Kicker } from "@/components/ui/Kicker";

/**
 * 一次情報（採用担当が確認済みの内容）の表示。
 * data/first-party-content.ts に確認済みの内容が無ければ何も描画しない
 * （空セクション・ダミーを出さない）。
 */
export function FirstPartyNotes({ id }: { id: string }) {
  const section = getFirstPartySection(id);
  if (!section) return null;

  return (
    <section className="border-t border-line bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <Kicker>{section.heading}</Kicker>
        {section.intro && (
          <p className="mt-2 text-[1.0625rem] leading-[1.9] text-ink-sub">
            {section.intro}
          </p>
        )}
        <ul className="mt-5 space-y-2.5">
          {section.items.map((t) => (
            <li key={t} className="flex items-start gap-2.5 leading-relaxed text-ink">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-dark"
              />
              {t}
            </li>
          ))}
        </ul>
        {section.confirmedAt && (
          <p className="mt-4 text-xs text-ink-sub">
            採用担当確認：{section.confirmedAt.replaceAll("-", ".")}
          </p>
        )}
      </div>
    </section>
  );
}
