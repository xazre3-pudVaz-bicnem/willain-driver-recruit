"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { submitApplication } from "@/app/apply/actions";
import {
  initialApplyFormState,
  areaOptions,
  LICENSE_VALUES,
  VEHICLE_VALUES,
  WORKDAYS_VALUES,
  START_VALUES,
} from "@/lib/apply-form";
import { trackEvent } from "@/lib/analytics";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-sub/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

function RequiredBadge() {
  return (
    <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
      必須
    </span>
  );
}

function OptionalBadge() {
  return (
    <span className="ml-2 rounded bg-gray-400 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
      任意
    </span>
  );
}

export function ApplyForm() {
  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialApplyFormState
  );
  const searchParams = useSearchParams();
  const preselectedArea = searchParams.get("area") ?? "";
  const startedAtRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // ボット対策用：フォーム表示時刻（hydration差異を避けるためDOMへ直接設定）
  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
  }, []);

  // 送信完了はサーバー側で/apply/thanksへリダイレクトされる。
  // エラー時はエラーサマリーへフォーカスを移動する（アクセシビリティ）。
  const hasErrors =
    Object.keys(state.errors).length > 0 || Boolean(state.formError);
  useEffect(() => {
    if (hasErrors) errorSummaryRef.current?.focus();
  }, [state, hasErrors]);

  const v = (key: string, fallback = "") => state.values[key] ?? fallback;

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={() => trackEvent("apply_submit", { status: "attempt" })}
      className="space-y-6"
    >
      {hasErrors && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border-2 border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          <p className="font-bold">入力内容をご確認ください。</p>
          {state.formError && <p className="mt-1">{state.formError}</p>}
          {Object.keys(state.errors).length > 0 && (
            <ul className="mt-1 list-disc pl-5">
              {Object.values(state.errors).map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ハニーポット：人間には見えないフィールド（入力されたらボットと判定） */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">この欄には入力しないでください</label>
        <input
          type="text"
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input
        type="hidden"
        name="started_at"
        ref={startedAtRef}
        defaultValue=""
      />

      {/* 氏名 */}
      <div>
        <label htmlFor="name" className="font-bold text-ink">
          氏名
          <RequiredBadge />
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="例：山田 太郎"
          defaultValue={v("name")}
          aria-invalid={state.errors.name ? true : undefined}
          aria-describedby={state.errors.name ? "error-name" : undefined}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError id="error-name" message={state.errors.name} />
      </div>

      {/* ふりがな */}
      <div>
        <label htmlFor="furigana" className="font-bold text-ink">
          ふりがな
          <RequiredBadge />
        </label>
        <input
          type="text"
          id="furigana"
          name="furigana"
          required
          placeholder="例：やまだ たろう"
          defaultValue={v("furigana")}
          aria-invalid={state.errors.furigana ? true : undefined}
          aria-describedby={state.errors.furigana ? "error-furigana" : undefined}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError id="error-furigana" message={state.errors.furigana} />
      </div>

      {/* 電話番号 */}
      <div>
        <label htmlFor="phone" className="font-bold text-ink">
          電話番号
          <RequiredBadge />
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="例：080-1234-5678"
          defaultValue={v("phone")}
          aria-invalid={state.errors.phone ? true : undefined}
          aria-describedby={state.errors.phone ? "error-phone" : undefined}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError id="error-phone" message={state.errors.phone} />
      </div>

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="font-bold text-ink">
          メールアドレス
          <RequiredBadge />
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="例：taro@example.com"
          defaultValue={v("email")}
          aria-invalid={state.errors.email ? true : undefined}
          aria-describedby={state.errors.email ? "error-email" : undefined}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError id="error-email" message={state.errors.email} />
      </div>

      {/* 希望エリア */}
      <fieldset>
        <legend className="font-bold text-ink">
          希望エリア
          <RequiredBadge />
        </legend>
        <div
          className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
          role="radiogroup"
          aria-describedby={state.errors.area ? "error-area" : undefined}
        >
          {areaOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 transition-colors has-checked:border-primary has-checked:bg-mint"
            >
              <input
                type="radio"
                name="area"
                value={option.value}
                required
                defaultChecked={
                  v("area", preselectedArea) === option.value
                }
                className="h-4 w-4 accent-(--color-primary)"
              />
              <span className="text-sm font-medium text-ink">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        <FieldError id="error-area" message={state.errors.area} />
      </fieldset>

      {/* 普通自動車免許 */}
      <fieldset>
        <legend className="font-bold text-ink">
          普通自動車免許の有無
          <RequiredBadge />
        </legend>
        <div
          className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
          role="radiogroup"
          aria-describedby={state.errors.license ? "error-license" : undefined}
        >
          {LICENSE_VALUES.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 transition-colors has-checked:border-primary has-checked:bg-mint"
            >
              <input
                type="radio"
                name="license"
                value={option}
                required
                defaultChecked={v("license") === option}
                className="h-4 w-4 accent-(--color-primary)"
              />
              <span className="text-sm font-medium text-ink">{option}</span>
            </label>
          ))}
        </div>
        <FieldError id="error-license" message={state.errors.license} />
      </fieldset>

      {/* 車両の有無 */}
      <div>
        <label htmlFor="vehicle" className="font-bold text-ink">
          車両の有無
          <OptionalBadge />
        </label>
        <select
          id="vehicle"
          name="vehicle"
          defaultValue={v("vehicle")}
          aria-invalid={state.errors.vehicle ? true : undefined}
          aria-describedby={state.errors.vehicle ? "error-vehicle" : undefined}
          className={`mt-2 ${inputClass}`}
        >
          <option value="">選択してください</option>
          {VEHICLE_VALUES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError id="error-vehicle" message={state.errors.vehicle} />
      </div>

      {/* 希望稼働日数 */}
      <div>
        <label htmlFor="work_days" className="font-bold text-ink">
          希望稼働日数
          <OptionalBadge />
        </label>
        <select
          id="work_days"
          name="work_days"
          defaultValue={v("work_days")}
          aria-invalid={state.errors.work_days ? true : undefined}
          aria-describedby={
            state.errors.work_days ? "error-work-days" : undefined
          }
          className={`mt-2 ${inputClass}`}
        >
          <option value="">選択してください</option>
          {WORKDAYS_VALUES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError id="error-work-days" message={state.errors.work_days} />
      </div>

      {/* 開始希望時期 */}
      <div>
        <label htmlFor="start_timing" className="font-bold text-ink">
          勤務開始希望時期
          <OptionalBadge />
        </label>
        <select
          id="start_timing"
          name="start_timing"
          defaultValue={v("start_timing")}
          aria-invalid={state.errors.start_timing ? true : undefined}
          aria-describedby={
            state.errors.start_timing ? "error-start-timing" : undefined
          }
          className={`mt-2 ${inputClass}`}
        >
          <option value="">選択してください</option>
          {START_VALUES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError
          id="error-start-timing"
          message={state.errors.start_timing}
        />
      </div>

      {/* 質問・相談 */}
      <div>
        <label htmlFor="message" className="font-bold text-ink">
          質問・相談内容
          <OptionalBadge />
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="例：副業として週3日から始めたいです。／リース車両について詳しく知りたいです。"
          defaultValue={v("message")}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      {/* プライバシーポリシー同意 */}
      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-mint/50 px-4 py-3.5">
          <input
            type="checkbox"
            name="privacy"
            required
            aria-invalid={state.errors.privacy ? true : undefined}
            aria-describedby={state.errors.privacy ? "error-privacy" : undefined}
            className="mt-0.5 h-4 w-4 accent-(--color-primary)"
          />
          <span className="text-sm leading-relaxed text-ink">
            <Link
              href="/privacy"
              className="font-bold text-primary underline underline-offset-2"
              target="_blank"
            >
              プライバシーポリシー
            </Link>
            に同意する
            <RequiredBadge />
          </span>
        </label>
        <FieldError id="error-privacy" message={state.errors.privacy} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary py-4 text-lg font-black text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "送信中です…" : "この内容で応募する"}
      </button>
      <p className="text-center text-xs leading-relaxed text-ink-sub">
        送信後、担当者よりご連絡します。お急ぎの方はお電話（080-7297-3908）でもご相談いただけます。
      </p>
    </form>
  );
}
