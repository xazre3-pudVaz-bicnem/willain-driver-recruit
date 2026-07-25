import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    title: "WEB応募・電話相談",
    text: "応募フォームまたは電話で連絡。「話を聞くだけ」でも受け付けています。",
  },
  {
    title: "面談",
    text: "希望エリア・稼働日数・車両の有無を確認し、担当エリアや案件の詳細を案内します。",
  },
  {
    title: "契約・車両準備",
    text: "業務委託契約の手続き。車両はリース（月額25,000円〜）か持ち込みを選べます。黒ナンバーの手続きも案内します。",
  },
  {
    title: "横乗り研修",
    text: "先輩の車に同乗し、荷物の積み方・配送アプリ・再配達の流れを現場で覚えます。",
  },
  {
    title: "稼働スタート",
    text: "担当エリアで配送開始。日額21,000円保証があるため、慣れるまでの収入も見通せます。",
  },
] as const;

/** 応募から稼働開始までの流れ（横罫線タイムライン・カードなし） */
export function ApplyFlow() {
  return (
    <ol className="border-t border-line">
      {steps.map((step, i) => (
        <li key={step.title} className="border-b border-line">
          <Reveal delay={Math.min(i * 0.06, 0.3)}>
            <div className="grid grid-cols-[auto_1fr] gap-x-5 py-6 md:grid-cols-[7rem_1fr] md:gap-x-8 md:py-7">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[0.6rem] font-black tracking-widest text-primary-dark">
                  STEP
                </span>
                <span className="text-3xl font-black tabular-nums text-primary-dark md:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-black text-ink md:text-xl">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-sub">
                  {step.text}
                </p>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
