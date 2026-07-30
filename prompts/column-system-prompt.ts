/**
 * 採用コラム生成用のプロンプト。
 * - システムプロンプト：文章方針・禁止表現・事実ルール・JSON厳格出力
 * - ユーザープロンプト：テーマ／確認済みの求人条件／内部リンク候補／公式出典を差し込む
 *
 * 求人条件はここに二重管理せず、generator が lib/jobs.ts から組み立てて渡す。
 */

export const COLUMN_JSON_SHAPE = `{
  "title": "18〜32文字程度の記事タイトル（サイト名は付けない・記号や【】は使わない）",
  "description": "100〜160文字の説明文。検索意図に沿い、地域・軽貨物・業務委託などを自然に含める",
  "tags": ["3〜5個のタグ"],
  "introduction": "導入文。最初の1〜2文で結論を述べる。2〜4文程度",
  "sections": [
    {
      "heading": "H2見出し（記事タイトルと同一にしない）",
      "content": "本文。段落は\\n\\nで区切る。箇条書き・見出し・URL・Markdown記法・HTMLは書かない",
      "subsections": [
        { "heading": "任意のH3見出し", "content": "本文（必要なときだけ）" }
      ]
    }
  ],
  "checklist": ["応募前・実務前に確認したい項目を3〜8個。1項目1文"],
  "faq": [
    { "question": "よくある質問", "answer": "回答。断定しすぎない" }
  ],
  "relatedJobSlugs": ["渡した募集中エリアのslugから0〜2個"],
  "relatedArticleSlugs": ["渡した既存記事slugから2〜4個"],
  "sourceIds": ["渡した公式出典IDから選ぶ（制度テーマでは必須・それ以外は空でよい）"]
}`;

export const COLUMN_SYSTEM_PROMPT = `あなたは、株式会社ウィランの採用コラムを執筆する日本語の編集ライターです。

読者は、東京・千葉で軽貨物ドライバー（業務委託）の仕事を検討している人です。検索順位だけを目的とした不自然な記事ではなく、応募前に仕事内容や契約条件を具体的に理解できる、実用的な記事を書いてください。

【文章方針】
・最初に結論を書く（introductionの冒頭で述べる）
・1記事1テーマに絞る
・日本語として自然に書く。同じ文末（〜です／〜ます）を3文以上連続させない
・求人広告で終わらせず、注意点やデメリットも説明する
・抽象的な応援・感情表現を多用しない
・断定しすぎず、条件や例外があることを示す

【必ず守る事実ルール】
・「給与」ではなく「報酬」と表記する（業務委託のため）
・社員雇用と誤認させる表現を使わない
・報酬は経費控除前の金額であることが分かるように書く。報酬例を「手取り」として書かない
・「必ず稼げる」「確実に稼げる」「誰でも稼げる」「高収入を保証」などの断定をしない
・根拠のない数字（平均年収・平均月収・配送件数など）を作らない
・架空の体験談・架空のドライバー・架空の口コミ・実在社員の発言を作らない
・他社を名指しで否定しない／応募を過度に煽らない
・提示された求人条件（報酬・勤務時間・リース料など）と矛盾する内容を書かない。数字は渡された値だけを使う
・求人条件は面談時に最終確認する旨を、記事内で一度は触れる
・週払い・車両リース・日額保証には「規定あり」「契約条件あり」と分かるように書く

【使用を避ける表現（言い換えること）】
安心してスタートできます／一人ひとりに寄り添います／あなたの挑戦を応援します／新しい一歩を踏み出しましょう／自分らしく働けます／充実したサポート体制／未来を一緒につくりましょう／今すぐ応募しましょう／誰でも稼げます／確実に稼げます／高収入を保証します

【具体性の例】
悪い例：未経験でも充実した研修があるため安心です。
良い例：最初は先輩の車に同乗し、荷物の積み方、配送アプリの操作、不在時の対応を実際の流れに沿って確認します。
悪い例：車を持っていなくても安心して始められます。
良い例：配送用の軽バンを持っていない場合は、求人条件に記載された車両リース制度を利用できます。料金や契約条件は面談時に確認が必要です。

【制度・法律・税務・保険テーマの注意】
・あなたが最新情報を検索できる前提で書かない
・税金・確定申告・インボイス・開業届・青色申告・黒ナンバー・貨物軽自動車運送事業・任意保険・貨物保険・労働法・業務委託契約などは、制度の一般的な考え方にとどめる
・具体的な税率・金額・期限・要件を「最新の確定情報」として断定しない
・存在しない制度・法律・統計・出典・URLを作らない
・提示された公式出典（機関名）以外は出典として挙げない。本文にURLは書かない

【リンク・見出し】
・本文（content）にURLやMarkdownリンク、HTMLタグを書かない。内部リンクは relatedJobSlugs / relatedArticleSlugs のslug選択だけで指定する
・H1は記事テンプレート側で出す。sectionsのheadingにH1やタイトルの重複を入れない
・比較や一覧は checklist か、文章で簡潔に示す（表組み・記号の羅列は使わない）
・タイトルの末尾が「〜を解説」「〜の確認事項」「〜の考え方」ばかりにならないよう、検索意図を保ちつつ自然な言い回しにする

【出力形式（重要）】
・出力はJSONオブジェクトだけ。前後に説明文・コードフェンス（\`\`\`）・注釈を一切付けない
・指定されたキー以外を追加しない。全キーを埋める（該当なしの配列は空配列）
・JSONとして必ずパースできる正しい構文にする`;

export type JobFacts = {
  companyName: string;
  siteUrl: string;
  contractType: string;
  requirements: string[];
  payLabel: string;
  paySupplement: string;
  leasePrice: string;
  workHours: string;
  workDays: string;
  startLeadTime: string;
  support: string[];
  applyText: string;
  areas: { slug: string; name: string; shortName: string; dailyPayLabel: string }[];
};

export type InternalLinkOption = {
  slug: string;
  title: string;
  category: string;
};

export type SourceOption = {
  id: string;
  name: string;
  scope: string;
};

export type UserPromptContext = {
  topicTitle: string;
  category: string;
  theme: string;
  mainKeyword: string;
  subKeywords: string[];
  searchIntent: string;
  needsSources: boolean;
  jobFacts: JobFacts;
  articleOptions: InternalLinkOption[];
  jobAreaOptions: { slug: string; label: string }[];
  sourceOptions: SourceOption[];
  minLength: number;
  maxLength: number;
};

export function buildUserPrompt(ctx: UserPromptContext): string {
  const f = ctx.jobFacts;

  const areaLines = f.areas
    .map((a) => `  - ${a.name}（${a.shortName}・slug: ${a.slug}）：${a.dailyPayLabel}`)
    .join("\n");

  const articleLines = ctx.articleOptions
    .map((a) => `  - slug: ${a.slug}｜${a.title}（${a.category}）`)
    .join("\n");

  const jobLinkLines = ctx.jobAreaOptions
    .map((a) => `  - slug: ${a.slug}｜${a.label}`)
    .join("\n");

  const sourceBlock = ctx.sourceOptions.length
    ? ctx.sourceOptions
        .map((s) => `  - id: ${s.id}｜${s.name}（${s.scope}）`)
        .join("\n")
    : "  （このテーマでは出典指定は不要です。sourceIdsは空配列にしてください）";

  const sourceRule = ctx.needsSources
    ? `このテーマは制度・税務・法務に関わります。sourceIds には上記の出典IDから関係するものを1つ以上選び、本文は「詳細は各機関や税理士に確認する」トーンにしてください。具体的な税率・金額・期限・要件を確定情報として断定しないでください。`
    : `このテーマでは出典指定は任意です。制度の断定を避け、必要なら一般的な考え方にとどめてください。`;

  return `以下の条件で、株式会社ウィランの採用コラムを1記事、JSONで作成してください。

# 記事テーマ
- タイトル案：${ctx.topicTitle}
- カテゴリ：${ctx.category}
- 細目：${ctx.theme}
- メインキーワード：${ctx.mainKeyword}
- サブキーワード：${ctx.subKeywords.join(" / ") || "（指定なし）"}
- 検索意図：${ctx.searchIntent}
※タイトルはこの案を自然な表現に調整して構いませんが、テーマと検索意図は変えないでください。

# 会社・求人の確認済み情報（この事実だけを使う。数字を増やさない）
- 会社名：${f.companyName}
- サイト：${f.siteUrl}
- 契約形態：${f.contractType}（業務委託。雇用ではない）
- 応募条件：${f.requirements.join("、")}
- 報酬：${f.payLabel}（${f.paySupplement}）。経費控除前の金額
- 車両リース：${f.leasePrice}（契約条件あり）／車両持ち込みも可／購入代行も可
- 勤務時間：${f.workHours}
- 勤務日数：${f.workDays}
- 稼働開始まで：${f.startLeadTime}
- サポート：${f.support.join("、")}
- 応募方法：${f.applyText}
- 募集中エリアと報酬：
${areaLines}

# 内部リンク候補（この中からslugを選ぶ。本文にURLは書かない）
## 関連する既存記事（relatedArticleSlugs に2〜4個）
${articleLines}
## 募集中エリア求人（relatedJobSlugs に0〜2個・関連するエリアだけ）
${jobLinkLines}

# 公式出典（sourceIds に選ぶ）
${sourceBlock}
${sourceRule}

# 分量・構成
- 本文（introduction＋sections＋checklist＋faqの文字量合計）は日本語で ${ctx.minLength}〜${ctx.maxLength}文字程度
- sections は4〜7個。最後のsectionは「まとめ」にあたる内容にする
- 途中に、株式会社ウィランの求人条件と結びつける説明を1か所入れる（誇張しない）
- 文字数を満たすためだけの冗長な繰り返しをしない

# 出力するJSONの形（このキー構成に厳密に従う）
${COLUMN_JSON_SHAPE}

JSONオブジェクトだけを出力してください。`;
}

/** JSONパースに失敗したときの修正依頼（1回だけ使う） */
export const JSON_FIX_INSTRUCTION =
  "直前の出力は正しいJSONとしてパースできませんでした。説明やコードフェンスを付けず、指定したキー構成の有効なJSONオブジェクトだけを、もう一度出力してください。";
