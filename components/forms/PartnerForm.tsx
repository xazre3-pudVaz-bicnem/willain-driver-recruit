"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { submitPartnerInquiry } from "@/app/partner/actions";
import { siteConfig } from "@/lib/site-config";
import {
  initialPartnerFormState,
  partnerTypes,
  resolvePartnerTypeParam,
} from "@/lib/partner";
import { trackEvent } from "@/lib/analytics";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-sub/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500";

/** 計測イベントで応募フォーム（ドライバー）と区別するための識別子 */
const FORM_TYPE = "partner";

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
    <span className="ml-2 rounded border border-line px-1.5 py-0.5 text-[0.65rem] font-bold text-ink-sub">
      任意
    </span>
  );
}

/**
 * 協力会社・パートナー・フランチャイズ募集の問い合わせフォーム。
 * 仕組み（送信・スパム対策・エラー時の代替連絡先・計測）は ApplyForm と同じ。
 * ?type=franchise|company|partner で募集区分を初期選択できる。
 */
export function PartnerForm() {
  const [state, formAction, isPending] = useActionState(
    submitPartnerInquiry,
    initialPartnerFormState
  );
  const searchParams = useSearchParams();
  const preselectedType = resolvePartnerTypeParam(searchParams.get("type"));
  const startedAtRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const formStartedRef = useRef(false);

  // ボット対策用：フォーム表示時刻（hydration差異を避けるためDOMへ直接設定）
  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
  }, []);

  // 送信完了はサーバー側で/partner/thanksへリダイレクトされる。
  // エラー時はエラーサマリーへフォーカスを移動＋form_errorを計測。
  const hasErrors =
    Object.keys(state.errors).length > 0 || Boolean(state.formError);
  useEffect(() => {
    if (hasErrors) {
      errorSummaryRef.current?.focus();
      trackEvent("form_error", {
        form_type: FORM_TYPE,
        error_count: Object.keys(state.errors).length,
      });
    }
  }, [state, hasErrors]);

  // フォームへの最初の入力で form_start を1回だけ計測
  const handleFirstInteraction = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent("form_start", { form_type: FORM_TYPE });
    }
  };

  const v = (key: string, fallback = "") => state.values[key] ?? fallback;

  return (
    <form
      action={formAction}
      noValidate
      onChange={handleFirstInteraction}
      className="space-y-6"
    >
      {hasErrors && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border-2 border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          <p className="font-bold">
            {state.formError ? "送信できませんでした" : "入力内容をご確認ください。"}
          </p>
          {state.formError && <p className="mt-1">{state.formError}</p>}
          {Object.keys(state.errors).length > 0 && (
            <ul className="mt-1 list-disc pl-5">
              {Object.values(state.errors).map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          )}
          {/* 送信失敗時は、問い合わせが途切れないよう別の連絡手段を必ず提示する */}
          {state.formError && (
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-red-200 pt-3">
              <a
                href={siteConfig.phoneLink}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-dark px-4 py-2 text-sm font-bold text-white"
              >
                電話で相談する（{siteConfig.phoneDisplay}）
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-dark px-4 py-2 text-sm font-bold text-primary-dark"
              >
                Instagramで相談
              </a>
            </div>
          )}
        </div>
      )}

      {/* ハニーポット：人間には見えないフィールド（入力されたらボットと判定） */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="partner_company_website">この欄には入力しないでください</label>
        <input
          type="text"
          id="partner_company_website"
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

      {/* 募集区分（?type= の変更で初期選択を反映させるため key で再マウント） */}
      <fieldset key={preselectedType}>
        <legend className="font-bold text-ink">
          募集区分
          <RequiredBadge />
        </legend>
        <div
          className="mt-2 grid grid-cols-1 gap-2"
          role="radiogroup"
          aria-describedby={
            state.errors.partner_type ? "error-partner-type" : undefined
          }
        >
          {partnerTypes.map((type) => (
            <label
              key={type.slug}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 transition-colors has-checked:border-primary has-checked:bg-mint"
            >
              <input
                type="radio"
                name="partner_type"
                value={type.label}
                required
                defaultChecked={v("partner_type", preselectedType) === type.label}
                className="h-4 w-4 accent-(--color-primary)"
              />
              <span className="text-sm font-medium text-ink">{type.label}</span>
            </label>
          ))}
        </div>
        <FieldError id="error-partner-type" message={state.errors.partner_type} />
      </fieldset>

      {/* 会社名・屋号 */}
      <div>
        <label htmlFor="partner_company" className="font-bold text-ink">
          会社名・屋号
          <OptionalBadge />
        </label>
        <input
          type="text"
          id="partner_company"
          name="company"
          autoComplete="organization"
          placeholder="例：株式会社○○運送／○○配送"
          defaultValue={v("company")}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      {/* お名前 */}
      <div>
        <label htmlFor="partner_name" className="font-bold text-ink">
          お名前（ご担当者さま）
          <RequiredBadge />
        </label>
        <input
          type="text"
          id="partner_name"
          name="name"
          required
          autoComplete="name"
          placeholder="例：山田 太郎"
          defaultValue={v("name")}
          aria-invalid={state.errors.name ? true : undefined}
          aria-describedby={state.errors.name ? "error-partner-name" : undefined}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError id="error-partner-name" message={state.errors.name} />
      </div>

      {/* 電話番号 */}
      <div>
        <label htmlFor="partner_phone" className="font-bold text-ink">
          電話番号
          <RequiredBadge />
        </label>
        <input
          type="tel"
          id="partner_phone"
          name="phone"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="例：080-1234-5678"
          defaultValue={v("phone")}
          aria-invalid={state.errors.phone ? true : undefined}
          aria-describedby={state.errors.phone ? "error-partner-phone" : undefined}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError id="error-partner-phone" message={state.errors.phone} />
      </div>

      {/* メールアドレス */}
      <div>
        <label htmlFor="partner_email" className="font-bold text-ink">
          メールアドレス
          <RequiredBadge />
        </label>
        <input
          type="email"
          id="partner_email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="例：info@example.com"
          defaultValue={v("email")}
          aria-invalid={state.errors.email ? true : undefined}
          aria-describedby={state.errors.email ? "error-partner-email" : undefined}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError id="error-partner-email" message={state.errors.email} />
      </div>

      {/* 所在地 */}
      <div>
        <label htmlFor="partner_location" className="font-bold text-ink">
          所在地（市区町村まで）
          <OptionalBadge />
        </label>
        <input
          type="text"
          id="partner_location"
          name="location"
          autoComplete="address-level2"
          placeholder="例：千葉県船橋市"
          defaultValue={v("location")}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      {/* 保有台数・稼働できる人数 */}
      <div>
        <label htmlFor="partner_scale" className="font-bold text-ink">
          保有台数・稼働できる人数
          <OptionalBadge />
        </label>
        <input
          type="text"
          id="partner_scale"
          name="scale"
          placeholder="例：軽バン3台・ドライバー4名"
          defaultValue={v("scale")}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      {/* ご相談内容 */}
      <div>
        <label htmlFor="partner_message" className="font-bold text-ink">
          ご相談内容
          <OptionalBadge />
        </label>
        <textarea
          id="partner_message"
          name="message"
          rows={4}
          placeholder="例：稼働できるエリアを知りたいです。／フランチャイズの契約条件を詳しく聞きたいです。"
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
            aria-describedby={state.errors.privacy ? "error-partner-privacy" : undefined}
            className="mt-0.5 h-4 w-4 accent-(--color-primary)"
          />
          <span className="text-sm leading-relaxed text-ink">
            <Link
              href="/privacy"
              className="font-bold text-primary-dark underline underline-offset-2"
              target="_blank"
            >
              プライバシーポリシー
            </Link>
            に同意する
            <RequiredBadge />
          </span>
        </label>
        <FieldError id="error-partner-privacy" message={state.errors.privacy} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary-dark py-4 text-lg font-black text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "送信中です…" : "この内容で問い合わせる"}
      </button>
      <p className="text-center text-xs leading-relaxed text-ink-sub">
        送信後、担当者よりご連絡します。お急ぎの方はお電話（{siteConfig.phoneDisplay}）でもご相談いただけます。
      </p>
    </form>
  );
}
