/**
 * 採用コラムのAI校閲（公開前の事実照合）。
 *
 * - 生成（Haiku・lib/anthropic.ts）とは別に、より強いモデル（既定 Claude Opus 5.5。ANTHROPIC_REVIEW_MODEL で変更可）へ
 *   確認済みの事実と記事を渡し、公開可否と修正指示を受け取る
 * - 応答は structured outputs（JSONスキーマ）で受け取り、zod で再検証する
 * - 修正の適用は applyReviewFixes で機械的に行う（一字一句一致し、1回だけ現れる箇所だけを置換）
 * - 校閲は公式SDK（API version 2026-10-21）で呼ぶ。生成側の fetch 実装（2023-06-01・temperature 指定）はそのまま
 * - APIキーやレスポンス全文はログに出さない
 */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import type { GeneratedColumn } from "@/lib/column-validator";
import { AnthropicError } from "@/lib/anthropic";
import {
  COLUMN_REVIEW_SYSTEM_PROMPT,
  REVIEW_OUTPUT_SCHEMA,
  buildReviewUserPrompt,
  type ReviewPromptContext,
} from "@/prompts/column-review-prompt";

export const DEFAULT_REVIEW_MODEL = "claude-opus-5-5";

export function resolveReviewModel(): string {
  const m = process.env.ANTHROPIC_REVIEW_MODEL?.trim();
  return m && m.length > 0 ? m : DEFAULT_REVIEW_MODEL;
}

const ReviewSchema = z.object({
  verdict: z.enum(["publish", "hold"]),
  summary: z.string(),
  fixes: z.array(
    z.object({
      field: z.string(),
      find: z.string(),
      replace: z.string(),
      reason: z.string(),
    }),
  ),
  holdReasons: z.array(z.string()),
});

export type ReviewFix = z.infer<typeof ReviewSchema>["fixes"][number];

export type ReviewResult = z.infer<typeof ReviewSchema> & {
  /** 実際に応答したモデル（安全分類で断られて代わりのモデルが答えた場合はそのモデル） */
  model: string;
  usage: { input: number; output: number };
};

/** 記事を校閲する。失敗時は AnthropicError を投げる（呼び出し側で下書き保存に回す） */
export async function reviewGeneratedColumn(
  ctx: ReviewPromptContext,
): Promise<ReviewResult> {
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    throw new AnthropicError("auth", "ANTHROPIC_API_KEY が設定されていません。");
  }
  // 429・5xx・接続エラーは SDK が指数バックオフで再試行する
  const client = new Anthropic({ maxRetries: 3, timeout: 10 * 60 * 1000 });
  const model = resolveReviewModel();

  let response: Anthropic.Beta.BetaMessage;
  try {
    response = await client.beta.messages.create({
      model,
      max_tokens: 16000,
      system: COLUMN_REVIEW_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildReviewUserPrompt(ctx) }],
      // 事実照合は精度を優先する（Opus 5.5 の thinking は常に adaptive。effort の既定は medium のため明示）
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: REVIEW_OUTPUT_SCHEMA },
      },
      // 安全分類で断られたときは、サーバー側で推奨モデルに切り替えて再実行する
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
  } catch (err) {
    throw toAnthropicError(err);
  }

  if (response.stop_reason === "refusal") {
    throw new AnthropicError("refusal", "校閲モデルが応答を拒否しました（stop_reason=refusal）。");
  }
  if (response.stop_reason === "max_tokens") {
    throw new AnthropicError("max_tokens", "校閲結果が max_tokens に達しました。");
  }
  if (response.stop_reason !== "end_turn") {
    throw new AnthropicError("bad_stop", `校閲で想定外の stop_reason（${response.stop_reason}）。`);
  }

  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  if (!text) throw new AnthropicError("empty", "校閲結果が空でした。");

  let parsed: z.infer<typeof ReviewSchema>;
  try {
    parsed = ReviewSchema.parse(JSON.parse(text));
  } catch {
    throw new AnthropicError("parse", "校閲結果のJSONを読み取れませんでした。");
  }

  return {
    ...parsed,
    model: response.model,
    usage: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
  };
}

/** SDK の例外を、生成側と同じ AnthropicError の種別に揃える（具体的なクラスから順に判定） */
function toAnthropicError(err: unknown): AnthropicError {
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return new AnthropicError("auth", `校閲APIの認証エラー（HTTP ${err.status}）。APIキーを確認してください。`, err.status);
  }
  if (err instanceof Anthropic.RateLimitError) {
    return new AnthropicError("rate_limit", "校閲APIのレート制限（再試行後も失敗）。", 429);
  }
  if (err instanceof Anthropic.BadRequestError || err instanceof Anthropic.NotFoundError) {
    return new AnthropicError("bad_request", `校閲APIのリクエストエラー（HTTP ${err.status}）：${err.message.slice(0, 200)}`, err.status);
  }
  if (err instanceof Anthropic.InternalServerError) {
    return new AnthropicError("server", `校閲APIのサーバーエラー（HTTP ${err.status}）。`, err.status);
  }
  if (err instanceof Anthropic.APIConnectionTimeoutError) {
    return new AnthropicError("timeout", "校閲APIがタイムアウトしました。");
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return new AnthropicError("network", "校閲APIに接続できませんでした。");
  }
  if (err instanceof Anthropic.APIError) {
    return new AnthropicError("server", `校閲APIのエラー（HTTP ${err.status ?? "不明"}）。`, err.status);
  }
  return new AnthropicError("network", "校閲APIの呼び出しに失敗しました（原因不明）。");
}

/* ------------------------------ 修正の適用（API不使用） ------------------------------ */

type FieldRef = { get: () => string; set: (v: string) => void };

/** "sections[2].content" のような指定を、記事の文字列フィールドに解決する */
function resolveField(gen: GeneratedColumn, field: string): FieldRef | null {
  if (field === "title" || field === "description" || field === "introduction") {
    return { get: () => gen[field], set: (v) => void (gen[field] = v) };
  }
  let m = field.match(/^sections\[(\d+)\]\.(heading|content)$/);
  if (m) {
    const s = gen.sections[Number(m[1])];
    const key = m[2] as "heading" | "content";
    return s ? { get: () => s[key], set: (v) => void (s[key] = v) } : null;
  }
  m = field.match(/^sections\[(\d+)\]\.subsections\[(\d+)\]\.(heading|content)$/);
  if (m) {
    const sub = gen.sections[Number(m[1])]?.subsections?.[Number(m[2])];
    const key = m[3] as "heading" | "content";
    return sub ? { get: () => sub[key], set: (v) => void (sub[key] = v) } : null;
  }
  m = field.match(/^checklist\[(\d+)\]$/);
  if (m) {
    const i = Number(m[1]);
    return i < gen.checklist.length
      ? { get: () => gen.checklist[i], set: (v) => void (gen.checklist[i] = v) }
      : null;
  }
  m = field.match(/^faq\[(\d+)\]\.(question|answer)$/);
  if (m) {
    const q = gen.faq[Number(m[1])];
    const key = m[2] as "question" | "answer";
    return q ? { get: () => q[key], set: (v) => void (q[key] = v) } : null;
  }
  return null;
}

export type ApplyFixesResult = {
  gen: GeneratedColumn;
  applied: number;
  failed: { fix: ReviewFix; why: string }[];
};

/**
 * 校閲の修正指示を記事に適用する（元の記事は変更しない）。
 * find が対象フィールドに一字一句・1回だけ現れる場合だけ置換し、それ以外は failed に入れる。
 */
export function applyReviewFixes(gen: GeneratedColumn, fixes: ReviewFix[]): ApplyFixesResult {
  const out = structuredClone(gen);
  const failed: ApplyFixesResult["failed"] = [];
  let applied = 0;

  for (const fix of fixes) {
    const ref = resolveField(out, fix.field.trim());
    if (!ref) {
      failed.push({ fix, why: "対象フィールドが見つからない" });
      continue;
    }
    if (!fix.find) {
      failed.push({ fix, why: "置換対象（find）が空" });
      continue;
    }
    const current = ref.get();
    const count = current.split(fix.find).length - 1;
    if (count !== 1) {
      failed.push({ fix, why: count === 0 ? "一致する文字列がない" : `一致が${count}か所ある` });
      continue;
    }
    // 置換文字列の $ を特殊文字として扱わないよう関数で置換する
    const next = current
      .replace(fix.find, () => fix.replace)
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    ref.set(next);
    applied++;
  }

  // 修正で空になったチェック項目・FAQは取り除く
  out.checklist = out.checklist.filter((c) => c.trim().length > 0);
  out.faq = out.faq.filter((f) => f.question.trim().length > 0 && f.answer.trim().length > 0);

  return { gen: out, applied, failed };
}
