"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  type ApplyFormState,
  AREA_VALUES,
  LICENSE_VALUES,
  VEHICLE_VALUES,
  WORKDAYS_VALUES,
  START_VALUES,
} from "@/lib/apply-form";

/* ---------------- スパム対策 ---------------- */

/**
 * 連続送信対策（IP単位のレート制限）。
 * サーバーレス環境ではインスタンスごとの制限になるが、
 * ハニーポット・最短入力時間チェックと併用して多層防御とする。
 */
const submissionLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10分
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    submissionLog.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  // メモリ肥大防止
  if (submissionLog.size > 5000) {
    const oldestKey = submissionLog.keys().next().value;
    if (oldestKey) submissionLog.delete(oldestKey);
  }
  return false;
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

export async function submitApplication(
  _prevState: ApplyFormState,
  formData: FormData
): Promise<ApplyFormState> {
  // --- ハニーポット（人間には見えないフィールド。入力があればボットと判定） ---
  const honeypot = sanitize(formData.get("company_website"), 200);
  if (honeypot) {
    // ボットには成功したように見せる
    redirect("/apply/thanks");
  }

  // --- 最短入力時間チェック（3秒未満の送信はボットとみなす） ---
  const startedAt = Number(sanitize(formData.get("started_at"), 20));
  if (!startedAt || Date.now() - startedAt < 3000) {
    return {
      errors: {},
      formError:
        "送信内容を確認できませんでした。お手数ですが、もう一度お試しください。改善しない場合は、お電話（080-7297-3908）でご連絡ください。",
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
      formError:
        "短時間に複数回の送信がありました。しばらく時間をおいてから再度お試しいただくか、お電話（080-7297-3908）でご連絡ください。",
      values: collectValues(formData),
    };
  }

  // --- 入力値の取得とサニタイズ ---
  const name = sanitizeLine(formData.get("name"), 60);
  const furigana = sanitizeLine(formData.get("furigana"), 60);
  const phone = sanitizeLine(formData.get("phone"), 20).replace(
    /[０-９]/g,
    (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  );
  const email = sanitizeLine(formData.get("email"), 254);
  const area = sanitizeLine(formData.get("area"), 30);
  const license = sanitizeLine(formData.get("license"), 30);
  const vehicle = sanitizeLine(formData.get("vehicle"), 40);
  const workDays = sanitizeLine(formData.get("work_days"), 20);
  const startTiming = sanitizeLine(formData.get("start_timing"), 30);
  const message = sanitize(formData.get("message"), 2000);
  const privacy = formData.get("privacy") === "on";

  // --- バリデーション（日本語エラー） ---
  const errors: Record<string, string> = {};

  if (!name) errors.name = "氏名を入力してください。";
  if (!furigana) {
    errors.furigana = "ふりがなを入力してください。";
  } else if (!/^[ぁ-んァ-ヶーｦ-ﾟ\s　]+$/.test(furigana)) {
    errors.furigana = "ふりがなは、ひらがなまたはカタカナで入力してください。";
  }
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
  if (!area || !AREA_VALUES.includes(area)) {
    errors.area = "希望エリアを選択してください。";
  }
  if (!license || !LICENSE_VALUES.includes(license)) {
    errors.license = "普通自動車免許の有無を選択してください。";
  }
  if (vehicle && !VEHICLE_VALUES.includes(vehicle)) {
    errors.vehicle = "車両の有無の選択が正しくありません。";
  }
  if (workDays && !WORKDAYS_VALUES.includes(workDays)) {
    errors.work_days = "希望稼働日数の選択が正しくありません。";
  }
  if (startTiming && !START_VALUES.includes(startTiming)) {
    errors.start_timing = "開始希望時期の選択が正しくありません。";
  }
  if (!privacy) {
    errors.privacy = "プライバシーポリシーへの同意が必要です。";
  }

  const values = collectValues(formData);
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  // --- メール送信（Resend） ---
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.APPLICATION_TO_EMAIL;
  const fromEmail = process.env.APPLICATION_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error(
      "[apply] RESEND_API_KEY / APPLICATION_TO_EMAIL / APPLICATION_FROM_EMAIL が未設定です。"
    );
    return {
      errors: {},
      formError:
        "現在フォームからの送信を受け付けられません。お手数ですが、お電話（080-7297-3908）でご連絡ください。",
      values,
    };
  }

  const rows: [string, string][] = [
    ["氏名", name],
    ["ふりがな", furigana],
    ["電話番号", phone],
    ["メールアドレス", email],
    ["希望エリア", area],
    ["普通自動車免許", license],
    ["車両の有無", vehicle || "（未選択）"],
    ["希望稼働日数", workDays || "（未選択）"],
    ["開始希望時期", startTiming || "（未選択）"],
    ["質問・相談内容", message || "（なし）"],
  ];

  const textBody = [
    "採用サイトの応募フォームから新しい応募がありました。",
    "",
    ...rows.map(([k, v]) => `■ ${k}\n${v}`),
    "",
    "---",
    "株式会社ウィラン 採用サイト",
  ].join("\n");

  const htmlBody = `<h2>採用サイトから新しい応募がありました</h2><table border="1" cellpadding="8" cellspacing="0">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("")}</table>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `【応募】軽貨物ドライバー（${area}希望）${name}様`,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`[apply] Resend API error: ${res.status} ${detail}`);
      return {
        errors: {},
        formError:
          "送信中にエラーが発生しました。お手数ですが、時間をおいて再度お試しいただくか、お電話（080-7297-3908）でご連絡ください。",
        values,
      };
    }
  } catch (err) {
    console.error("[apply] Resend request failed:", err);
    return {
      errors: {},
      formError:
        "送信中にエラーが発生しました。お手数ですが、時間をおいて再度お試しいただくか、お電話（080-7297-3908）でご連絡ください。",
      values,
    };
  }

  redirect("/apply/thanks");
}

function collectValues(formData: FormData): Record<string, string> {
  const keys = [
    "name",
    "furigana",
    "phone",
    "email",
    "area",
    "license",
    "vehicle",
    "work_days",
    "start_timing",
    "message",
  ];
  const values: Record<string, string> = {};
  for (const key of keys) {
    const v = formData.get(key);
    if (typeof v === "string") values[key] = v.slice(0, 2000);
  }
  return values;
}
