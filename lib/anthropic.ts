/**
 * Anthropic Messages API の最小クライアント（fetchのみ・SDK不要）。
 *
 * - モデルは ANTHROPIC_MODEL（未設定なら DEFAULT_MODEL）。複数箇所に直書きしない。
 * - temperature のみ指定（top_p は指定しない）。extended thinking は使わない。
 * - 429 / 5xx / ネットワーク/タイムアウトは指数バックオフで最大3回再試行（5s→15s→45s）。
 * - stop_reason が end_turn / stop_sequence 以外（refusal・max_tokens等）はエラーにする。
 * - APIキーやレスポンス全文はログに出さない（呼び出し側でも同様）。
 */

export const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

export function resolveModel(): string {
  const m = process.env.ANTHROPIC_MODEL?.trim();
  return m && m.length > 0 ? m : DEFAULT_MODEL;
}

export type AnthropicErrorType =
  | "auth"
  | "rate_limit"
  | "server"
  | "timeout"
  | "network"
  | "refusal"
  | "max_tokens"
  | "bad_stop"
  | "empty"
  | "bad_request";

export class AnthropicError extends Error {
  type: AnthropicErrorType;
  status?: number;
  constructor(type: AnthropicErrorType, message: string, status?: number) {
    super(message);
    this.name = "AnthropicError";
    this.type = type;
    this.status = status;
  }
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type MessageResult = {
  text: string;
  model: string;
  stopReason: string;
  usage: { input_tokens: number; output_tokens: number };
};

export type CreateMessageOptions = {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  /** 1回のリクエストのタイムアウト（ms） */
  timeoutMs?: number;
  /** 再試行回数（429/5xx/ネットワーク） */
  maxRetries?: number;
};

const BACKOFF_MS = [5000, 15000, 45000];
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 1メッセージ生成。成功時はテキストとトークン使用量を返す。
 * APIキーは引数で渡さず、環境変数 ANTHROPIC_API_KEY を使う。
 */
export async function createMessage(
  opts: CreateMessageOptions,
): Promise<MessageResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new AnthropicError(
      "auth",
      "ANTHROPIC_API_KEY が設定されていません。GitHub Secrets もしくは .env.local に設定してください。",
    );
  }

  const model = resolveModel();
  const maxRetries = opts.maxRetries ?? 3;
  const timeoutMs = opts.timeoutMs ?? 120_000;

  const body = JSON.stringify({
    model,
    max_tokens: opts.maxTokens ?? 8000,
    temperature: opts.temperature ?? 0.6, // top_p は指定しない
    system: opts.system,
    messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  let lastError: AnthropicError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const wait = BACKOFF_MS[Math.min(attempt - 1, BACKOFF_MS.length - 1)];
      await sleep(wait);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body,
        signal: controller.signal,
      });

      if (res.status === 429 || res.status >= 500) {
        // 再試行対象。本文は読み捨て（ログに全文を出さない）
        await res.text().catch(() => "");
        lastError = new AnthropicError(
          res.status === 429 ? "rate_limit" : "server",
          `Anthropic API ${res.status}（再試行 ${attempt}/${maxRetries}）`,
          res.status,
        );
        continue;
      }

      if (res.status === 401 || res.status === 403) {
        throw new AnthropicError("auth", `認証エラー（HTTP ${res.status}）。APIキーを確認してください。`, res.status);
      }

      if (!res.ok) {
        // 400系など。エラーメッセージ種別だけ拾う（全文は出さない）
        const info = await safeErrorType(res);
        throw new AnthropicError("bad_request", `リクエストエラー（HTTP ${res.status}${info ? `：${info}` : ""}）`, res.status);
      }

      const json = (await res.json()) as AnthropicResponse;
      const stopReason = json.stop_reason ?? "unknown";

      if (stopReason === "refusal") {
        throw new AnthropicError("refusal", "モデルが生成を拒否しました（stop_reason=refusal）。");
      }
      if (stopReason === "max_tokens") {
        throw new AnthropicError("max_tokens", "出力が max_tokens に達しました。記事を保存できません。");
      }
      if (stopReason !== "end_turn" && stopReason !== "stop_sequence") {
        throw new AnthropicError("bad_stop", `想定外の stop_reason（${stopReason}）。記事を保存しません。`);
      }

      const text = (json.content ?? [])
        .filter((b) => b.type === "text" && typeof b.text === "string")
        .map((b) => b.text as string)
        .join("")
        .trim();

      if (!text) {
        throw new AnthropicError("empty", "空のレスポンスを受け取りました。");
      }

      return {
        text,
        model: json.model ?? model,
        stopReason,
        usage: {
          input_tokens: json.usage?.input_tokens ?? 0,
          output_tokens: json.usage?.output_tokens ?? 0,
        },
      };
    } catch (err) {
      if (err instanceof AnthropicError) {
        // 再試行対象（rate_limit/server）以外は即throw
        if (err.type === "rate_limit" || err.type === "server") {
          lastError = err;
          continue;
        }
        throw err;
      }
      // AbortError（タイムアウト）やネットワークエラー → 再試行
      const isAbort = (err as Error)?.name === "AbortError";
      lastError = new AnthropicError(
        isAbort ? "timeout" : "network",
        isAbort ? `タイムアウト（${timeoutMs}ms・再試行 ${attempt}/${maxRetries}）` : `ネットワークエラー（再試行 ${attempt}/${maxRetries}）`,
      );
      continue;
    } finally {
      clearTimeout(timer);
    }
  }

  throw (
    lastError ??
    new AnthropicError("network", "Anthropic API 呼び出しに失敗しました（原因不明）。")
  );
}

type AnthropicResponse = {
  model?: string;
  stop_reason?: string;
  content?: { type: string; text?: string }[];
  usage?: { input_tokens?: number; output_tokens?: number };
};

async function safeErrorType(res: Response): Promise<string | null> {
  try {
    const j = (await res.json()) as { error?: { type?: string } };
    return j?.error?.type ?? null;
  } catch {
    return null;
  }
}
