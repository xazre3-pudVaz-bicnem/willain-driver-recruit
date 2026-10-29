/**
 * 採用コラムのAI校閲（公開前の事実照合）用プロンプト。
 * - 生成（Haiku）とは別の、より強いモデルで「確認済みの事実との食い違い」と「根拠のない主張」を探す
 * - 修正は「対象フィールド・一字一句同じ抜き出し・置き換え文」の組で返させ、適用は generator 側で機械的に行う
 *
 * 事実はここに二重管理せず、generator が lib/jobs.ts から組み立てて渡す。
 */

import type { GeneratedColumn } from "@/lib/column-validator";
import type { JobFacts } from "@/prompts/column-system-prompt";

/**
 * サイトとして確認済みの方針（求人データに入っていない、記事で間違えやすい点）。
 * 2026-10 時点でウィランに確認した内容・サイト内で説明済みの内容だけを書く。
 */
export const CONFIRMED_SITE_POLICIES: string[] = [
  "仕事は主にAmazon関連の通販商品を個人宅へ届ける配送。企業配送やオフィス配送が中心だとは書かない",
  // 「報酬を保証」はサイトの品質検証（収入保証の断定）で不合格になる表現のため、ここでも使わない
  "日額保証は、配達件数に関わらず1日あたりの報酬額が決まっている仕組み（規定あり）。報酬が配達個数や配送スピードで変わるとは書かない。「報酬を保証」「収入を保証」とは書かず「日額保証（規定あり）」と書く",
  "ガソリン代は、業務委託のため原則としてドライバー負担。具体的な範囲は面談で確認する",
  "任意保険・貨物保険などの費用負担は契約条件による。面談で確認する",
  "勤務日数は週3日〜週6日で「相談可能」。選べる・確約できるとは書かない",
  "応募資格は普通自動車免許（AT限定可）・学歴不問・未経験歓迎。年齢不問とは書かない",
  "1日の配送個数・拠点の稼働人数・募集人数は、拠点情報に書かれたその拠点の数字（2026年10月時点）だけを使う。拠点をまたいで流用しない",
  "葛西拠点については「深夜の配送は原則なし」と書かない（荷物の到着が遅い日は終了が遅くなることがあるため）",
  "拠点の住所は拠点情報に書かれた範囲だけを使う（品川・江東・葛西・船橋は町名まで。世田谷・調布・横浜は番地まで公開している）。担当エリアは面談で案内する",
  "世田谷・調布・横浜は2026年10月に新しく開設した拠点で、稼働中のドライバーはまだいない（オープニングメンバーの募集）。配送エリアは未定なので、町名や配送先の地域・建物の傾向を書かない。この3拠点のドライバーの声や働き方の実例を書かない",
  "世田谷拠点の所在地「世田谷区船橋」は世田谷区内の地名。千葉県船橋市の船橋拠点と混同しない",
  "架空のドライバー・体験談・口コミ・社員の発言を書かない",
];

export const COLUMN_REVIEW_SYSTEM_PROMPT = `あなたは株式会社ウィランの採用コラムの校閲担当です。AIが書いた記事を、渡された「確認済みの事実」と照らし合わせ、公開してよいかを判定し、必要な修正を指示します。

【直すもの】
1. 確認済みの事実（求人条件・拠点・配送エリア・勤務時間・報酬・車両・研修・サポート・サイトの方針）と矛盾する記述
2. 確認済みの事実にない、ウィランについての具体的な主張（数字、制度、待遇、配送先の傾向、年齢不問など）。削除するか、事実の範囲の表現に直す
3. そのエリアの配送エリアにない町名・地名をウィランの配送先として書いている記述
4. 日額保証と矛盾する記述（報酬が配達個数で変わる など）
5. 確認済みの言い方より強い表現（「相談可能」を「選べる」と書く、「規定あり」を外す など）
6. 税金・法律・保険の具体的な制度・数字・期限を確定情報として断定している記述

【直さないもの】
- 業界一般の説明（例：都心は交通量が多い、慣れると効率が上がる）。断定しすぎていなければ残す
- 文体や言い回しの好みだけの修正

【修正の書き方】
- field は次のいずれか（i, j は0始まりの番号）："title" "description" "introduction" "sections[i].heading" "sections[i].content" "sections[i].subsections[j].heading" "sections[i].subsections[j].content" "checklist[i]" "faq[i].question" "faq[i].answer"
- find には、そのフィールドの文字列から一字一句そのまま抜き出した部分を入れる。そのフィールドの中で1回だけ現れる、文単位の長さにする
- replace には置き換え後の文を入れる。確認済みの事実だけを使い、新しい事実や数字を足さない。文を消すときは空文字にする
- replace に、断定・誇大表現（「必ず稼げる」「確実に稼げる」「誰でも稼げる」「報酬を保証」「収入を保証」など）や、Markdown記法（**太字** など）を入れない。サイトの品質検証で不合格になる
- reason に、どの事実と食い違うか・なぜ根拠がないかを短く書く

【判定（verdict）】
- 修正を適用すれば公開してよい記事は "publish"
- 次の場合は "hold" にして、holdReasons に理由を書く：記事の主題そのものが事実と合わない／修正が15か所を超える／専門家の確認が必要な制度の説明が中心／確認済みの事実だけでは直せない
- summary に、確認の結果を1〜2文で書く

出力は指定のJSONスキーマに従うこと。`;

/** 校閲結果のJSONスキーマ（structured outputs 用。additionalProperties:false が必須） */
export const REVIEW_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["publish", "hold"] },
    summary: { type: "string" },
    fixes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string" },
          find: { type: "string" },
          replace: { type: "string" },
          reason: { type: "string" },
        },
        required: ["field", "find", "replace", "reason"],
        additionalProperties: false,
      },
    },
    holdReasons: { type: "array", items: { type: "string" } },
  },
  required: ["verdict", "summary", "fixes", "holdReasons"],
  additionalProperties: false,
} as const;

export type ReviewPromptContext = {
  topicTitle: string;
  mainKeyword: string;
  searchIntent: string;
  jobFacts: JobFacts;
  /** 募集中エリアごとの拠点の確認済み情報（記事のエリアがあれば先頭） */
  areaFacts: { name: string; lines: string[] }[];
  /** 記事が特定エリアのものなら、そのエリア名 */
  topicAreaName?: string;
  /** 仕事の流れ・研修の確認済みの内容（lib/jobs.ts の dayFlow・trainingFacts） */
  workFlow: string[];
  article: GeneratedColumn;
};

export function buildReviewUserPrompt(ctx: ReviewPromptContext): string {
  const f = ctx.jobFacts;
  const areaPay = f.areas
    .map((a) => `  - ${a.name}（${a.shortName}）：${a.dailyPayLabel}`)
    .join("\n");
  const areaBlocks = ctx.areaFacts
    .map((a) => `## ${a.name}\n${a.lines.map((l) => `- ${l}`).join("\n")}`)
    .join("\n\n");

  return `次の採用コラムを校閲してください。

# 記事のテーマ
- タイトル案：${ctx.topicTitle}
- メインキーワード：${ctx.mainKeyword}
- 検索意図：${ctx.searchIntent}
${ctx.topicAreaName ? `- 対象エリア：${ctx.topicAreaName}（このエリアの拠点情報と照らす）` : "- 対象エリア：特定なし（エリアについて書いた部分は、そのエリアの拠点情報と照らす）"}

# 確認済みの事実：会社・求人条件
- 会社名：${f.companyName}
- 契約形態：${f.contractType}（業務委託。雇用ではない）
- 応募条件：${f.requirements.join("、")}
- 報酬：${f.payLabel}（${f.paySupplement}）。経費控除前の金額
- エリア別の報酬：
${areaPay}
- 車両リース：${f.leasePrice}（契約条件あり）／車両持ち込みも可／購入代行も可
- 勤務時間：${f.workHours}
- 勤務日数：${f.workDays}
- 稼働開始まで：${f.startLeadTime}
- サポート：${f.support.join("、")}
- 応募方法：${f.applyText}

# 確認済みの事実：仕事の流れ・研修
${ctx.workFlow.map((l) => `- ${l}`).join("\n")}

# 確認済みの事実：拠点・配送エリア・1日の流れ
${areaBlocks}

# 確認済みの事実：サイトの方針
${CONFIRMED_SITE_POLICIES.map((p) => `- ${p}`).join("\n")}

# 校閲する記事（JSON）
${JSON.stringify(ctx.article, null, 2)}`;
}
