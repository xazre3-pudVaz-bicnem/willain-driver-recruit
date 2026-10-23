"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site-config";
import { type PartnerFormState, PARTNER_TYPE_VALUES } from "@/lib/partner";

/*
 * 協力会社・パートナー・フランチャイズ募集の問い合わせ。
 * 送信・スパム対策・env未設定時のフォールバック・自動返信は app/apply/actions.ts と同じ仕組み。
 * 送信先も応募フォームと同じ RESEND_API_KEY / APPLICATION_TO_EMAIL を使う（新しいenvは不要）。
 */

/* ---------------- スパム対策 ---------------- */

/**
 * 連続送信対策（IP単位のレート制限）。
 * サーバーレス環境ではインスタンスごとの制限になるが、
 * ハニーポット・最短入力時間チェックと併用して多層防御とする。
 */
const submissionLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10分
const RATE_LIMIT_MAX = 5; // 10分内に成功できる送信回数

/** レート制限の「判定のみ」（副作用なし）。成功送信のみ recordSubmission でカウントする。 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  submissionLog.set(ip, timestamps);
  return timestamps.length >= RATE_LIMIT_MAX;
}

/** 問い合わせが正常に受理された時のみ呼び、送信回数を記録する。 */
function recordSubmission(ip: string): void {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  // メモリ肥大防止
  if (submissionLog.size > 5000) {
    const oldestKey = submissionLog.keys().next().value;
    if (oldestKey) submissionLog.delete(oldestKey);
  }
}

/** 入力のサニタイズ：制御文字を除去し長さを制限する（改行・タブは保持） */
function sanitize(value: FormDataEntryValue | null, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** 1行フィールド用：改行も除去（メールヘッダインジェクション対策） */
function sanitizeLine(value: FormDataEntryValue | null, maxLength: number): string {
  return sanitize(value, maxLength).replace(/[\r\n]/g, " ");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------- 本体 ---------------- */

export async function submitPartnerInquiry(
  _prevState: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  const phoneFallback = `お電話（${siteConfig.phoneDisplay}）`;

  // --- ハニーポット（人間には見えないフィールド。入力があればボットと判定） ---
  const honeypot = sanitize(formData.get("company_website"), 200);
  if (honeypot) {
    // ボットには成功したように見せる
    redirect("/partner/thanks");
  }

  // --- 最短入力時間チェック（極端に速い送信のみボットとみなす） ---
  // started_at が取得できた場合のみ判定する（値が無い/不正なときは正規の問い合わせをブロックしない）。
  const startedAt = Number(sanitize(formData.get("started_at"), 20));
  const MIN_ELAPSED_MS = 1500;
  if (
    Number.isFinite(startedAt) &&
    startedAt > 0 &&
    Date.now() - startedAt < MIN_ELAPSED_MS
  ) {
    return {
      errors: {},
      formError: `送信が速すぎたため確認できませんでした。もう一度「この内容で問い合わせる」を押してください。改善しない場合は、${phoneFallback}でご連絡ください。`,
      values: collectValues(formData),
    };
  }

  // --- レート制限 ---
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return {
      errors: {},
      formError: `短時間に複数回の送信がありました。しばらく時間をおいてから再度お試しいただくか、${phoneFallback}でご連絡ください。`,
      values: collectValues(formData),
    };
  }

  // --- 入力値の取得とサニタイズ ---
  const partnerType = sanitizeLine(formData.get("partner_type"), 40);
  const company = sanitizeLine(formData.get("company"), 100);
  const name = sanitizeLine(formData.get("name"), 60);
  const phone = sanitizeLine(formData.get("phone"), 20).replace(
    /[０-９]/g,
    (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  );
  const email = sanitizeLine(formData.get("email"), 254);
  const location = sanitizeLine(formData.get("location"), 60);
  const scale = sanitizeLine(formData.get("scale"), 100);
  const message = sanitize(formData.get("message"), 2000);
  const privacy = formData.get("privacy") === "on";

  // --- バリデーション（日本語エラー） ---
  const errors: Record<string, string> = {};

  if (!partnerType || !PARTNER_TYPE_VALUES.includes(partnerType)) {
    errors.partner_type = "募集区分を選択してください。";
  }
  if (!name) errors.name = "お名前を入力してください。";
  if (!phone) {
    errors.phone = "電話番号を入力してください。";
  } else {
    // 日本の電話番号は0始まりの10〜11桁
    const digits = phone.replace(/[^0-9]/g, "");
    if (!/^0\d{9,10}$/.test(digits)) {
      errors.phone = "電話番号の形式が正しくありません（例：080-1234-5678）。";
    }
  }
  if (!email) {
    errors.email = "メールアドレスを入力してください。";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "メールアドレスの形式が正しくありません。";
  }
  if (!privacy) {
    errors.privacy = "プライバシーポリシーへの同意が必要です。";
  }

  const values = collectValues(formData);
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  // --- メール送信（Resend） ---
  // 応募フォームと同じく、必須は RESEND_API_KEY と APPLICATION_TO_EMAIL の2つだけ。
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.APPLICATION_TO_EMAIL;
  const fromEmail = process.env.APPLICATION_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    console.error(
      "[partner] RESEND_API_KEY / APPLICATION_TO_EMAIL が未設定です。Vercelの環境変数を設定してください。"
    );
    return {
      errors: {},
      formError: `現在フォームからの送信を受け付けられません。お手数ですが、${phoneFallback}でご連絡ください。`,
      values,
    };
  }

  const rows: [string, string][] = [
    ["募集区分", partnerType],
    ["会社名・屋号", company || "（未記入）"],
    ["お名前", name],
    ["電話番号", phone],
    ["メールアドレス", email],
    ["所在地", location || "（未記入）"],
    ["保有台数・稼働できる人数", scale || "（未記入）"],
    ["ご相談内容", message || "（なし）"],
  ];

  const textBody = [
    "採用サイトの協力会社・パートナー募集ページから、新しいお問い合わせがありました。",
    "",
    ...rows.map(([k, v]) => `■ ${k}\n${v}`),
    "",
    "---",
    "株式会社ウィラン 採用サイト（/partner）",
  ].join("\n");

  const htmlBody = `<h2>協力会社・パートナー募集ページから新しいお問い合わせがありました</h2><table border="1" cellpadding="8" cellspacing="0">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("")}</table>`;

  // ① 担当者への通知メール（必須）。失敗したら送信エラーにする。
  const notifyResult = await sendResendEmail(apiKey, {
    from: fromEmail,
    to: [toEmail],
    reply_to: email, // 担当者が返信すると問い合わせ者に届く
    subject: `【協力会社・パートナー募集】${partnerType}｜${company || name}様`,
    text: textBody,
    html: htmlBody,
  });
  if (!notifyResult.ok) {
    return {
      errors: {},
      formError: `送信中にエラーが発生しました。お手数ですが、時間をおいて再度お試しいただくか、${phoneFallback}でご連絡ください。`,
      values,
    };
  }

  // ② 問い合わせ者への自動返信。届かなくても問い合わせ自体は成立させる（ベストエフォート）。
  const ackText = [
    `${name} 様`,
    "",
    "この度は、株式会社ウィランの協力会社・パートナー募集にお問い合わせいただき、誠にありがとうございます。",
    "以下の内容で受け付けました。担当者より順次ご連絡いたしますので、少々お待ちください。",
    "",
    ...rows.map(([k, v]) => `■ ${k}\n${v}`),
    "",
    "※このメールは自動送信です。ご返信いただくと担当者に届きます。",
    `お急ぎの場合は、${phoneFallback}でもご相談いただけます。`,
    "",
    "---",
    siteConfig.companyName,
    `${siteConfig.siteUrl}/partner`,
  ].join("\n");

  const ackHtml = `<p>${escapeHtml(name)} 様</p>
<p>この度は、株式会社ウィランの協力会社・パートナー募集にお問い合わせいただき、誠にありがとうございます。<br>
以下の内容で受け付けました。担当者より順次ご連絡いたしますので、少々お待ちください。</p>
<table border="1" cellpadding="8" cellspacing="0">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("")}</table>
<p style="color:#555;font-size:13px">※このメールは自動送信です。ご返信いただくと担当者に届きます。<br>
お急ぎの場合は、${escapeHtml(phoneFallback)}でもご相談いただけます。</p>
<p style="color:#555;font-size:13px">${escapeHtml(siteConfig.companyName)}<br>
<a href="${siteConfig.siteUrl}/partner">${siteConfig.siteUrl}/partner</a></p>`;

  // 入力メールが正しい前提。失敗しても問い合わせは成立（担当者には届いている）。
  await sendResendEmail(apiKey, {
    from: fromEmail,
    to: [email],
    reply_to: toEmail, // 問い合わせ者が返信すると担当者に届く
    subject: "【株式会社ウィラン】お問い合わせありがとうございます",
    text: ackText,
    html: ackHtml,
  });

  // 正常に受理された時のみレート制限にカウントする
  recordSubmission(ip);
  redirect("/partner/thanks");
}

/** Resendでメールを1通送る。成功可否だけ返す（本文全文はログに出さない）。 */
async function sendResendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string[];
    reply_to: string;
    subject: string;
    text: string;
    html: string;
  }
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[partner] Resend API error: ${res.status} ${detail}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[partner] Resend request failed:", err);
    return { ok: false };
  }
}

function collectValues(formData: FormData): Record<string, string> {
  const keys = [
    "partner_type",
    "company",
    "name",
    "phone",
    "email",
    "location",
    "scale",
    "message",
  ];
  const values: Record<string, string> = {};
  for (const key of keys) {
    const v = formData.get(key);
    if (typeof v === "string") values[key] = v.slice(0, 2000);
  }
  return values;
}
