import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    title: "WEB応募・電話相談",
    text: "応募フォーム（60秒）またはお電話でご連絡ください。「話を聞いてみたい」だけでも歓迎です。",
  },
  {
    title: "面談",
    text: "希望エリア・稼働日数・車両の有無などをお伺いし、詳細な集合場所・担当エリア・案件内容をご案内します。",
  },
  {
    title: "各種手続き・車両準備",
    text: "業務委託契約の手続きを行います。車両はリース（月額25,000円〜）または持ち込みを選べます。黒ナンバーの手続きもご案内します。",
  },
  {
    title: "横乗り研修",
    text: "先輩ドライバーの車に同乗し、積み込みから配送完了までの流れを実際に体験しながら覚えます。",
  },
  {
    title: "稼働スタート",
    text: "研修後、担当エリアで稼働開始。日額21,000円保証があるため、慣れない期間も収入の見通しを立てやすい環境です。",
  },
] as const;

/** 応募から稼働開始までの流れ */
export function ApplyFlow() {
  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {steps.map((step, i) => (
        <li key={step.title}>
          <Reveal delay={Math.min(i * 0.08, 0.35)} className="h-full">
            <div className="relative h-full rounded-2xl border border-line bg-white p-5 shadow-card">
              <span className="text-xs font-black tracking-widest text-primary">
                STEP {i + 1}
              </span>
              <h3 className="mt-1.5 font-black text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-sub">
                {step.text}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
