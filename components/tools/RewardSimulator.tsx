"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * 軽貨物ドライバーの報酬・経費シミュレーター（クライアント計算）。
 * 税金・社会保険・国民健康保険・年金は自動計算せず、「控除前の残額（参考値）」だけを示す。
 * 手取りや保証額として断定しない。
 */

export type AreaPreset = {
  slug: string;
  shortName: string;
  dailyPay: number;
  dailyPayLabel: string;
};

type Props = {
  areas: AreaPreset[];
  leaseDefault: number;
};

const yen = (n: number) => `${Math.round(n).toLocaleString("ja-JP")}円`;

type FieldKey =
  | "workDays"
  | "lease"
  | "gasoline"
  | "parking"
  | "insurance"
  | "maintenance"
  | "other";

export function RewardSimulator({ areas, leaseDefault }: Props) {
  const [dailyPay, setDailyPay] = useState<number>(areas[0]?.dailyPay ?? 20500);
  const [fields, setFields] = useState<Record<FieldKey, number>>({
    workDays: 22,
    lease: leaseDefault,
    gasoline: 30000,
    parking: 15000,
    insurance: 10000,
    maintenance: 5000,
    other: 5000,
  });

  const set = (k: FieldKey, v: string) =>
    setFields((f) => ({ ...f, [k]: Math.max(0, Number(v) || 0) }));

  const { gross, expenses, remainder } = useMemo(() => {
    const gross = dailyPay * fields.workDays;
    const expenses =
      fields.lease +
      fields.gasoline +
      fields.parking +
      fields.insurance +
      fields.maintenance +
      fields.other;
    return { gross, expenses, remainder: gross - expenses };
  }, [dailyPay, fields]);

  const numberField = (
    key: FieldKey,
    label: string,
    unit: string,
    hint?: string,
  ) => (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-bold text-ink">
        {label}
        {hint && <span className="ml-1 font-normal text-ink-sub">{hint}</span>}
      </span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={fields[key]}
          onChange={(e) => set(key, e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-ink focus:border-primary-dark focus:outline-none"
        />
        <span className="shrink-0 text-sm text-ink-sub">{unit}</span>
      </span>
    </label>
  );

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
      {/* 入力 */}
      <div className="space-y-5">
        <div>
          <p className="text-sm font-bold text-ink">エリア（日額の初期値）</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {areas.map((a) => (
              <button
                key={a.slug}
                type="button"
                onClick={() => {
                  setDailyPay(a.dailyPay);
                  trackEvent("simulator_area_select", { job_area: a.slug });
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  dailyPay === a.dailyPay
                    ? "border-primary-dark bg-primary-dark text-white"
                    : "border-line bg-white text-ink-sub hover:border-primary-dark"
                }`}
              >
                {a.shortName}（{a.dailyPayLabel}）
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-ink">日額報酬</span>
          <span className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={dailyPay}
              onChange={(e) => setDailyPay(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-ink focus:border-primary-dark focus:outline-none"
            />
            <span className="shrink-0 text-sm text-ink-sub">円/日</span>
          </span>
        </label>

        {numberField("workDays", "月の稼働日数", "日")}
        {numberField("lease", "車両リース料", "円/月", "（持ち込みは0）")}
        {numberField("gasoline", "ガソリン代", "円/月")}
        {numberField("parking", "駐車場代", "円/月")}
        {numberField("insurance", "保険料", "円/月", "（任意・貨物保険など）")}
        {numberField("maintenance", "整備積立額", "円/月")}
        {numberField("other", "その他の事業経費", "円/月")}
      </div>

      {/* 結果 */}
      <div className="md:sticky md:top-24 md:self-start">
        <div className="rounded-2xl border border-line bg-paper p-6">
          <dl className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-bold text-ink-sub">月額報酬（額面）</dt>
              <dd className="text-xl font-black text-ink">{yen(gross)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-line pt-4">
              <dt className="text-sm font-bold text-ink-sub">入力した経費合計</dt>
              <dd className="text-xl font-black text-ink">−{yen(expenses)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t-2 border-primary-dark pt-4">
              <dt className="text-sm font-bold text-ink">
                税金・社会保険を引く前の残額
              </dt>
              <dd
                className={`text-2xl font-black ${remainder >= 0 ? "text-primary-dark" : "text-red-600"}`}
              >
                {yen(remainder)}
              </dd>
            </div>
          </dl>
          <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-xs leading-relaxed text-ink-sub">
            これは「手取り」ではありません。ここから所得税・住民税・国民健康保険・国民年金などが別途かかります。日額保証や実際の手取りを保証する金額ではなく、入力値から経費を差し引いた参考値です。
          </p>
          <Link
            href="/jobs"
            onClick={() => trackEvent("simulator_to_jobs", {})}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary-dark px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            エリアごとの日額・条件を求人ページで見る
          </Link>
        </div>
      </div>
    </div>
  );
}
