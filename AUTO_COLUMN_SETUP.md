# 採用コラム自動投稿システム 運用ガイド

株式会社ウィランの採用サイトに、Claude Haiku API で採用コラムを週2回（月・木）自動生成し、Claude Opus 5.5 によるAI校閲（確認済みの求人データ・拠点情報との照合）に合格した記事だけを自動公開する仕組みです（2026-10-26〜。それまでは下書き＋担当者確認の運用）。WordPressは使いません。生成記事は既存のコラム実装（Next.js / App Router / TypeScriptデータ）に統合され、一覧・詳細・カテゴリ・関連記事・sitemap・RSSへ自動反映されます。

- 記事の保存先: `content/column/generated/<slug>.ts`（`ColumnArticle` 形式）
- 使用モデル: 生成は `claude-haiku-4-5-20251001`（`ANTHROPIC_MODEL` で変更可）、AI校閲は `claude-opus-5-5`（`ANTHROPIC_REVIEW_MODEL` で変更可）
- 実行: GitHub Actions（週2回 / 手動）
- 既定の公開モード: `ai-review`（AI校閲に合格した記事だけ公開。保留・失敗・制度テーマは下書き＋失敗通知）
- ローカル確認: `npm run column:validate`（API不要）/ `npm run column:generate:dry`（API必要）

---

## 1. Anthropic APIキーの取得方法

1. https://console.anthropic.com にログイン
2. 「API Keys」→「Create Key」でキーを発行
3. 発行された `sk-ant-...` をコピー（この画面でしか全体を確認できません）

> キーはコード・ログ・生成記事・READMEに直接書かないでください。GitHub Secretsに保存します。

## 2. GitHub Secretsへの登録方法

1. GitHubのリポジトリ → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
   - Name: `ANTHROPIC_API_KEY`
   - Secret: 取得したAPIキー
3. 保存

これだけで自動投稿は動きます（他は既定値で動作）。

## 3. ANTHROPIC_MODELの設定

既定は `claude-haiku-4-5-20251001` です。変更したい場合のみ設定します。

- Secret もしくは Variable として `ANTHROPIC_MODEL` を追加（**Settings → Secrets and variables → Actions → Variables** でも可）
- 例: `ANTHROPIC_MODEL = claude-haiku-4-5-20251001`
- 未設定なら既定値が使われます。コストを抑えるためHaiku固定を推奨します。

## 4. GitHub Actionsの手動実行方法

1. リポジトリ → **Actions** タブ
2. 左メニュー **Auto Publish Column** を選択
3. **Run workflow** → ブランチ `main` を選んで実行
4. 生成に成功すると `Auto publish column: 記事タイトル`（下書きなら `Auto draft column: …`）というコミットが自動で作成され、Vercelが再デプロイします
5. **dry_run** にチェックを入れて実行すると、生成とAI校閲だけを行い、保存・公開はしません（ログとジョブサマリーで結果を確認できます）

> 同じ日にすでに自動投稿済みの場合は、二重投稿されません（`data/generation-log.json` で判定）。

## 5. 実行のタイミング

- **日本時間 毎週 月曜・木曜の午前5時**（`.github/workflows/generate-column.yml` の `cron: "0 20 * * 0,3"` = 日・水のUTC20時）
- GitHubのscheduleは負荷状況により数分〜数十分ずれることがあります。

## 6. dry-runの方法

記事ファイルの保存・commit・pushをせず、テーマ選定〜生成〜検証〜重複〜SEO検証まで実行します。

```bash
# ローカルに .env.local（ANTHROPIC_API_KEY=...）を用意してから
npm run column:generate:dry
```

APIを使わずにパイプライン（コーパス健全性・テーマ選定・検証・重複・画像・ブロック変換）だけ確認する場合:

```bash
npm run column:validate
```

## 7. テーマ追加方法

`data/column-topics.ts` の `columnTopics` 配列に追記します。

```ts
{
  id: "unique-id",                 // 重複しない安定ID（履歴照合に使用）
  title: "記事タイトル案",
  slugHint: "english-slug",        // URL・ファイル名（既存slugと重複させない）
  category: "仕事内容",             // 仕事内容 / 働き方・契約 / お金・報酬 / 独立・キャリア
  theme: "配送実務",               // 表示・履歴用の細目
  mainKeyword: "軽貨物 ○○",
  subKeywords: ["…", "…"],
  searchIntent: "読者が知りたいこと",
  imageCategory: "delivery",       // driver/van/cargo/warehouse/city/training/delivery/apply
  needsSources: false,             // 制度・税務・法務なら true
  sourceIds: [],                   // needsSources時に official-sources のIDを指定
  // area: "shinagawa",            // 特定エリア記事のときだけ
},
```

- 未使用テーマを上から順に消化します。全消化後に新しいテーマが必要になります。
- 既存記事と検索意図が重なるテーマは、生成前・生成後の重複判定で自動スキップされます。

## 8. 禁止テーマの設定方法

- **キューに入れない**のが基本です（`columnTopics` に載せなければ生成されません）。
- 制度・税務・法務テーマは `needsSources: true` かつ `sourceIds` に登録済み出典が必要です。出典が未登録だと、そのテーマは生成されずスキップされます（`data/official-sources.ts` で管理）。
- 一時的に止めたいテーマは、その要素をコメントアウトするか配列から外してください。

## 9. 記事画像の追加方法

画像は `public/images/photos/` の既存写真（AI生成のイメージ画像）から自動割当します。追加する場合:

1. WebP画像を `public/images/photos/` に配置（ファイル名は内容が分かる英数字に。例 `delivery-van-tokyo.webp`）
2. `data/column-images.ts` の `columnImages` に追記

```ts
{
  path: "/images/photos/delivery-van-tokyo.webp",
  category: "delivery",
  alt: "東京の街並みと配送用軽バンのイメージ", // 実写と誤認させない「〜のイメージ」表記
  width: 1200, height: 900,
  usedCount: 0, lastUsedAt: null,
},
```

- 同じ画像は直近5記事以内で再利用しません（`data/column-history.json` の使用実績で判定）。
- AI生成画像を実在の社員・実車として説明しないでください。

## 10. 生成失敗時の確認方法

- **GitHub Actions のログ**: Actions → Auto Publish Column → 該当実行。どのステップで止まったか、スキップ理由が表示されます（APIキー・レスポンス全文は出力しません）。
- **要対応（ジョブ失敗＝GitHubから失敗通知が届く・commitなし）**: 品質検証NG（1回だけ自動で修正を依頼し、それでもNGの場合）/ 重複超過 / 未使用テーマなし。
  - 2026-07-29〜10-22 は品質検証NGが「正常終了」扱いだったため、86回すべて不合格でも気づけなかった。その再発防止。
  - 失敗通知は、ワークフローの `cron` を最後に変更したGitHubユーザーに届く（GitHubの通知設定で Actions の失敗通知を有効にしておく）。
- **要確認の下書き（commit してからジョブ失敗＝通知）**: AI校閲で保留 / 修正を適用できない / 修正後に品質検証NG / AI校閲のAPIエラー / 制度テーマ。下書きを確認して直し、`status:"published"` にすれば公開されます。
- **スキップ**（正常終了・commitなし）: 同日投稿済み / 上限到達 / `AUTO_COLUMN_ENABLED=false`。
- **失敗**（ジョブがfail) : APIエラー（429/5xxは最大3回リトライ後）、JSON2回失敗、build/lint/型/SEO検証NG。**失敗時はmainへ不完全な記事をpushしません。**
- **エラー履歴**: `data/generation-log.json` に `status: "error"` と `errorType` が残ります（保存できた場合）。

## 11. 自動投稿の停止方法

いずれかで停止できます。

- **一時停止（推奨）**: リポジトリ **Variables** に `AUTO_COLUMN_ENABLED = false` を追加。APIを呼ばず正常終了します。
- **完全停止**: `.github/workflows/generate-column.yml` の `schedule:` をコメントアウト（手動実行のみ残す）またはワークフローを無効化（Actions画面の「…」→ Disable workflow）。

再開は `AUTO_COLUMN_ENABLED` を `true`（または削除）に戻します。

## 12. 求人条件変更時の更新場所

記事内の報酬・勤務条件は **`lib/jobs.ts` を唯一の情報源**として自動で差し込みます（記事側に二重管理しません）。

- 全エリア共通条件: `lib/jobs.ts` の `jobCommon`（報酬レンジ・リース料・勤務時間・勤務日数・サポート等）
- エリア別の日額: 各エリアの `dailyPay` / `dailyPayLabel`
- 募集終了: エリアの `isActive: false`（一覧・sitemap・記事リンク対象から自動的に外れます）

変更後は記事と求人ページの条件が自動的に一致します。生成時の検証でも、求人条件と食い違う金額表記（日額・月額）はエラーになります。

## 13. 公式出典の追加方法

税務・法務・保険・運送事業などの制度テーマで参照する出典は `data/official-sources.ts` で管理します。

```ts
{
  id: "nta",
  name: "国税庁",
  url: "https://www.nta.go.jp/",  // 公式ドメインの安定URLのみ
  checkedDate: "2026-07-29",       // リンク確認日
  scope: "確定申告・青色申告・開業届 など",
},
```

- 登録済みの出典だけが記事に使えます（未登録IDは検証でエラー）。
- 制度テーマで出典が未登録の場合、そのテーマは生成せず別テーマを選びます。
- 記事末尾には自動で免責文（「制度や手続きは変更される場合があります…」）を表示します。

## 14. 投稿履歴の確認方法

- `data/column-history.json`: 生成済み記事の一覧（title / slug / mainKeyword / searchIntent / category / publishedAt / summary / relatedJob / contentHash / image）。重複防止・画像ローテーションの判定に使います。**手で編集しないでください。**
- 公開記事そのものは `content/column/generated/` 配下と `/column` 一覧で確認できます。

## 15. API利用量の確認方法

- **GitHub Actionsログ**: 生成成功時に `model / input_tokens / output_tokens / title` を表示します。
- **累積**: `data/generation-log.json` に1回ごとの `date / model / title / slug / inputTokens / outputTokens / status / errorType` を記録します。月間の概算はこのファイルを集計してください。

```bash
# 今月の概算トークン合計（例）
node -e "const l=require('./data/generation-log.json');const m='2026-07';const s=l.filter(x=>x.date.startsWith(m));console.log('in',s.reduce((a,b)=>a+b.inputTokens,0),'out',s.reduce((a,b)=>a+b.outputTokens,0),'記事',s.filter(x=>x.status==='published').length)"
```

---

## 公開モード（ai-review / review / auto）と AI表記

`AUTO_COLUMN_MODE`（Variables）で運用を切り替えます。GitHub Actions では未設定なら `ai-review`（ワークフローで既定値を指定）、ローカル実行では未設定なら `auto`。

- **ai-review**（既定）：品質検証を通過した記事を、別モデル（既定 `claude-opus-5-5`）が確認済みの事実と照合します。
  - 校閲は「対象フィールド・一字一句同じ抜き出し・置き換え文」の組で修正を返し、プログラムが機械的に適用します（一致しない・複数一致する修正は適用しない）。
  - 修正後の記事で品質検証・重複判定をやり直します。
  - 公開するのは「校閲が publish・修正をすべて適用できた・修正後も品質検証を通った・制度テーマではない」記事だけです。
  - それ以外は下書きで保存し、ジョブを失敗させて通知します（理由はジョブの注釈とサマリーに出ます）。
  - 公開記事は「株式会社ウィラン 編集部」名義で、「AIを補助的に利用して作成し、公開前にAIで求人データ・拠点情報との照合を行っています（担当者による内容確認前の記事です）」と表示します。
    人が確認したわけではないので「採用担当が確認」とは表示しません。
  - 校閲の判定基準（サイトとして確認済みの方針）は `prompts/column-review-prompt.ts` の `CONFIRMED_SITE_POLICIES` で管理します。求人条件や方針が変わったら合わせて更新してください。
  - 費用の目安：校閲1回あたり約0.1〜0.2ドル（Opus 5.5・effort high）。週2回で月1〜2ドル程度。

- **auto**：品質検証を通過した記事を自動公開します。著者は「株式会社ウィラン 編集部」名義で、
  「承認済みの求人データと公式情報をもとにAIを補助的に利用して作成」と表示します
  （担当者が個別に執筆・確認したとは表示しません）。
- **review**：記事を `status:"draft"`（下書き）で保存します。一覧・sitemap・RSSには出ません。
  担当者が内容を確認したら、`content/column/generated/<slug>.ts` の
  `humanReviewed:true` / `reviewedBy` / `reviewedAt` を設定し、`status:"published"` に変更してください。
  このとき初めて「採用担当が確認」と表示されます。

税務・法務・保険・黒ナンバー・契約に関わるテーマは、`AUTO_COLUMN_MODE=auto` でも**常に下書き**として保存され、
人間確認を経るまで公開されません。

実行結果は次の4種です：**公開 / 下書き / スキップ / エラー**。記事には品質スコア（0〜100）が付き、
`data/generation-log.json` に記録されます。

## コスト・安全設計の要点

- 1回の実行でAPIは記事生成1回（JSON修正・品質検証NGの修正が必要な場合のみ追加）＋ ai-review ではAI校閲1回。
- AI校閲は公式SDK（`@anthropic-ai/sdk`・API version 2026-10-21）で呼びます。temperature は送らず、`effort: high`、JSONスキーマ（structured outputs）で応答を受け取り、安全分類で断られた場合はサーバー側の推奨モデルへ自動で切り替えます（`fallbacks: "default"`）。
- 記事生成は従来どおり `lib/anthropic.ts`（fetch・API version 2023-06-01・`temperature: 0.6`）。新しいAPIバージョンでは temperature が使えないため、生成側を移行するときは temperature をやめるかどうかを決める必要があります。
- `temperature: 0.6` のみ指定（top_pは併用しない）。`max_tokens: 8000`。extended thinkingは不使用。
- `stop_reason` が `refusal` / `max_tokens` / 想定外のときは保存せずエラー。
- 429・5xxは指数バックオフ（5s→15s→45s）で最大3回リトライ。
- `.env.local` はコミットしません（`.gitignore` に `.env` / `.env.local` / `.env*.local`）。
- 生成物は品質検証（文字数・見出し数・slug・禁止表現・架空情報・求人整合・リンク存在・出典）を通過したものだけ公開します。
