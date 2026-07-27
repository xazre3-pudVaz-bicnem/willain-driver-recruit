import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Kicker } from "@/components/ui/Kicker";
import { CtaSection } from "@/components/job/CtaSection";

export const metadata: Metadata = {
  title: "独立・開業サポート｜軽貨物から始めるキャリア支援",
  description:
    "株式会社ウィランの独立支援制度を紹介します。軽貨物ドライバーとして経験を積みながら、確定申告サポート・税理士紹介・独立支援制度で、独立・開業を目指す方のキャリアを東京・千葉で支援します。",
  alternates: { canonical: "/independence-support" },
  openGraph: {
    title: "独立・開業サポート｜株式会社ウィラン",
    description:
      "軽貨物ドライバーから独立・開業へ。ウィランの独立支援制度とキャリアステップを紹介します。",
    url: "/independence-support",
    type: "website",
  },
};

const steps = [
  {
    phase: "STEP 1",
    title: "業務委託ドライバーとして基礎を築く",
    text: "まずは軽貨物ドライバーとして安定して稼げる状態をつくります。日額保証（エリアにより日額20,000〜22,000円）のもとで配送スキルを磨きながら、個人事業主としての第一歩を踏み出します。",
  },
  {
    phase: "STEP 2",
    title: "個人事業の運営感覚を身につける",
    text: "稼働管理・経費の考え方・確定申告など、個人事業主に必要な知識を実践で習得。ウィランでは確定申告の相談や税理士の紹介など、事業運営の土台づくりをサポートします。",
  },
  {
    phase: "STEP 3",
    title: "独立支援制度で次のステージへ",
    text: "経験を積んだ先の独立・開業に向けて、独立支援制度を用意しています。目指す姿は人それぞれ。あなたの目標に合わせた進み方を面談で一緒に考えます。",
  },
] as const;

const supports = [
  {
    title: "独立支援制度",
    text: "軽貨物事業での独立を目指す方向けの支援制度です。制度の内容・条件は面談時に詳しくご案内します。",
  },
  {
    title: "確定申告サポート・税理士紹介",
    text: "個人事業主として避けて通れない税務。確定申告に関する相談を受け付け、必要に応じて税理士を紹介します。",
  },
  {
    title: "社員登用制度",
    text: "独立とは別の道として、社員登用の制度もあります。「組織の中でキャリアを積みたい」という希望にも応えます。",
  },
  {
    title: "経験者からのアドバイス",
    text: "現場で稼働するドライバーや運営メンバーから、実践的な働き方・稼ぎ方のアドバイスを受けられる環境です。",
  },
] as const;

export default function IndependenceSupportPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ name: "独立・開業サポート", path: "/independence-support" }]}
      />

      {/* ヒーロー：大きな写真を片側に */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:gap-14 md:py-20">
          <div>
            <Reveal>
              <Kicker>独立・開業サポート</Kicker>
            </Reveal>
            <Reveal>
              <h1 className="h-section text-ink">配送だけで、終わらない。</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[1.0625rem] leading-[1.9] text-ink-sub">
                軽貨物は、配送の仕事であると同時に「小さな事業の経営」でもあります。業務委託ドライバーとしての稼働を独立への助走と捉え、将来の目標に向けたキャリアを支援します。もちろん「独立は考えていない」方も、そのまま長く働けます。
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Photo
              src="/images/photos/walking.webp"
              alt="配送へ向かう株式会社ウィランの軽貨物ドライバー"
              aspect="aspect-[4/5]"
              rounded="rounded-sm"
              sizes="(max-width: 768px) 100vw, 50vw"
              position="object-[center_35%]"
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* ステップ：横罫線タイムライン（カードなし） */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Kicker animate>独立までの道のり</Kicker>
        <Reveal>
          <h2 className="h-section mb-10 text-ink">3ステップで、力をつける。</h2>
        </Reveal>
        <ol className="border-t border-line">
          {steps.map((step, i) => (
            <li key={step.title} className="border-b border-line">
              <Reveal delay={i * 0.08}>
                <div className="grid grid-cols-[auto_1fr] gap-x-5 py-6 md:grid-cols-[7rem_1fr] md:gap-x-8 md:py-7">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[0.6rem] font-black tracking-widest text-primary-dark">
                      STEP
                    </span>
                    <span className="text-3xl font-black tabular-nums text-primary-dark md:text-4xl">
                      0{i + 1}
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
      </section>

      {/* サポート内容：濃色背景・半透明罫線 */}
      <section className="bg-emerald-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-24">
          <div>
            <Reveal>
              <Kicker light>サポート内容</Kicker>
            </Reveal>
            <Reveal>
              <h2 className="h-section text-white">
                事業の土台を、
                <br />
                一緒に。
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-base leading-[1.9] text-white/70">
                独立・開業の成果を保証するものではありません。各制度には規定・条件があります。進め方は面談時に相談できます。
              </p>
            </Reveal>
          </div>
          <div className="border-t border-white/15">
            {supports.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.06, 0.2)}>
                <div className="flex gap-5 border-b border-white/15 py-5">
                  <span className="text-sm font-black tabular-nums text-primary-light">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-black text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 関連コラム：罫線リンクリスト */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Kicker animate>関連する採用コラム</Kicker>
        <Reveal>
          <h2 className="h-section mb-8 text-ink">もっと知る。</h2>
        </Reveal>
        <Reveal>
          <ul className="border-t border-line">
            {[
              {
                href: "/column/independence-guide",
                t: "軽貨物から独立・開業を目指す方法とステップ",
              },
              {
                href: "/column/gyomu-itaku-basics",
                t: "軽貨物の業務委託とは？雇用契約との違い",
              },
              {
                href: "/column/tax-return-basics",
                t: "軽貨物ドライバーが確定申告前に確認したいこと",
              },
            ].map((c) => (
              <li key={c.href} className="border-b border-line">
                <Link
                  href={c.href}
                  className="group flex items-center justify-between gap-4 py-5 font-bold text-ink transition-colors hover:text-primary-dark"
                >
                  {c.t}
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-primary-dark transition-transform group-hover:translate-x-1"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M6 3.5L10.5 8L6 12.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <CtaSection
        title="将来の独立も、今の安定も。"
        text="独立への関心度がどの段階でも構いません。あなたの目標を面談でお聞かせください。"
        place="independence"
      />
    </>
  );
}
