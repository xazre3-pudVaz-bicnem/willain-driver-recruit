import { dayFlow } from "@/lib/jobs";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";

/**
 * 1日の流れ。カードを使わず、左に細い縦線の縦タイムラインで表現する。
 * 途中に配送写真を差し込む。具体的な時刻は案件により異なるため表示しない。
 */
export function DayFlow() {
  // 写真を差し込む工程のインデックス
  const photoAfter: Record<number, { src: string; alt: string }> = {
    2: {
      src: "/images/photos/work-driving.webp",
      alt: "軽バンで担当エリアへ向かうドライバー",
    },
    5: {
      src: "/images/photos/work-delivery.webp",
      alt: "個人宅へ荷物を届けるドライバー",
    },
  };

  return (
    <div>
      <ol className="relative border-l border-line pl-6 md:pl-8">
        {dayFlow.map((item, i) => (
          <li key={item.step} className="relative pb-9 last:pb-0">
            {/* 番号（線上のノード） */}
            <span className="absolute top-0 -left-[calc(1.5rem+1px)] flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-[0.7rem] font-black text-white md:-left-[calc(2rem+1px)]">
              {i + 1}
            </span>
            <Reveal delay={Math.min(i * 0.04, 0.25)}>
              <h3 className="text-lg font-black text-ink md:text-xl">
                {item.step}
              </h3>
              <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-sub">
                {item.text}
              </p>
              {photoAfter[i] && (
                <div className="mt-5 max-w-md">
                  <Photo
                    src={photoAfter[i].src}
                    alt={photoAfter[i].alt}
                    aspect="aspect-[16/10]"
                    sizes="(max-width: 768px) 90vw, 420px"
                  />
                </div>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
      <p className="mt-6 pl-6 text-xs text-ink-sub md:pl-8">
        ※時間配分は担当エリア・案件・時期によって異なります。詳細は面談時にご案内します。
      </p>
    </div>
  );
}
