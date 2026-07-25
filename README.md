# 株式会社ウィラン 軽貨物ドライバー採用サイト

東京（品川区・江東区・江戸川区葛西エリア）・千葉（船橋市）で軽貨物ドライバー（業務委託）の応募を増やすことに特化した採用サイトです。

- フレームワーク: Next.js（App Router）+ TypeScript + Tailwind CSS v4
- フォーム送信: Server Action + Resend
- 構造化データ: JobPosting（Googleしごと検索対応）/ Organization / WebSite / BreadcrumbList / FAQPage / Article

## セットアップ

```bash
npm install
cp .env.example .env.local   # 値を設定
npm run dev
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript型チェック |
| `npm run indexing:update` | 求人ページをGoogle Indexing APIへ更新通知（任意） |
| `npm run indexing:delete` | 求人ページの削除（募集終了）通知（任意） |

## 環境変数

`.env.example` を参照。すべて未設定でもビルドは成功します。

| 変数 | 必須 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 公開時必須 | canonical・OGP・sitemap・構造化データの絶対URL生成 |
| `RESEND_API_KEY` | 公開時必須 | 応募フォームのメール送信（Resend） |
| `APPLICATION_TO_EMAIL` | 公開時必須 | 応募通知の送信先（採用担当） |
| `APPLICATION_FROM_EMAIL` | 公開時必須 | 送信元（Resend認証済みドメインのアドレス） |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 任意 | Search Console所有権確認メタタグ |
| `NEXT_PUBLIC_GA_ID` | 任意 | GA4測定ID（未設定でもエラーになりません） |
| `NEXT_PUBLIC_GTM_ID` | 任意 | Google Tag Manager ID |
| `GOOGLE_INDEXING_CLIENT_EMAIL` | 任意 | Indexing API用サービスアカウント |
| `GOOGLE_INDEXING_PRIVATE_KEY` | 任意 | 同上（秘密鍵。改行は `\n` のままでOK） |

## ★ 公開前確認事項（必ず株式会社ウィランへ確認）

1. **本社所在地・営業拠点所在地を株式会社ウィランへ最終確認する。**
   現在は「東京都中央区銀座1丁目12番4号 N&E BLD.6F」を掲載しているが、Instagram等に別所在地が掲載されている可能性がある。確定後は `lib/site-config.ts` の `address` を1か所修正すれば全ページへ反映される。
2. **勤務日数の表記を確認する。** Indeed内に「週4〜6日」と「週3〜6日」の両方の記載があったため、現在サイトでは「週3日〜週6日で相談可能」としている。正しい条件を確認し、`lib/jobs.ts` の `workDays` / `workDaysDetail` を修正する。
   ※求人条件・FAQは `lib/jobs.ts` を参照して自動反映されるが、トップページの文言と採用コラム記事の一部にも「週3日」の記述があるため、条件が変わる場合はプロジェクト全体を「週3日」で検索して確認すること。
3. **求人の公開日（datePosted）を実際の公開日に更新する。** `lib/jobs.ts` の各エリアの `datePosted` は仮で `2026-07-25` になっている。サイト公開日に合わせて1度だけ設定し、以後ビルドで自動変更しない（Googleしごと検索のポリシー対応）。
4. **応募通知の送信先メールアドレス**（`APPLICATION_TO_EMAIL`）を採用担当に確認して設定する。
5. **週払い・入社祝金・紹介報奨金・車両リースの規定内容**を面談時説明と齟齬がないか確認する。
6. **ロゴ画像・写真素材**を受領したら差し替える（下記「画像の差し替え」参照）。
7. **公開ドメイン確定後**、`NEXT_PUBLIC_SITE_URL` を設定し、Search Consoleにプロパティを登録する。
8. 日本語入りのOGP画像を制作した場合は `app/opengraph-image.tsx` を置き換えるか、各ページの `openGraph.images` で指定する（現状は英字ベースの自動生成画像）。

## 画像の差し替え

同名ファイルを上書きして `npm run build` を再実行すると差し替わります。

| パス | 用途 | 備考 |
| --- | --- | --- |
| `public/images/hero-driver.webp` | トップのヒーロー画像（全面背景） | 推奨: 日本人の若いドライバー＋白い軽バン＋東京の街並み。文字なし。16:9程度の横長。存在しない場合はブランドカラーのグラデーションにフォールバック |
| `public/images/logo.png` | ヘッダー・フッターのロゴ（透過PNG推奨） | このパスを直接読み込む。読み込みに失敗した場合は会社ブランド名テキストにフォールバックする（svgの自動判定は行わない） |
| `public/images/photos/*.webp` | 各ページのセクション写真 | 同名で上書き |

## Googleしごと検索（Google for Jobs）対応

- JobPosting構造化データは **エリア別求人詳細ページのみ** に実装（求人一覧 `/jobs` には無し）:
  - `/jobs/shinagawa` `/jobs/koto` `/jobs/kasai` `/jobs/funabashi`
- 画面表示とJSON-LDは同じ `lib/jobs.ts` のデータから生成しているため、内容は常に一致します。
- `title` は職種名「軽貨物ドライバー」のみ。`employmentType: CONTRACTOR`、`JPY` / `DAY`、`addressCountry: JP`、エリアごとの固有 `identifier` を設定済み。
- `validThrough` は募集期限が未定のため未設定。期限が決まったら `lib/jsonld.ts` の `jobPostingJsonLd` に追加してください。
- **募集終了時**: 該当エリアを `lib/jobs.ts` から外して（JobPostingとページを削除または更新）、`npm run indexing:delete -- <slug>` で通知。

## Google Indexing API の設定手順

求人ページの追加・更新・募集終了をGoogleへ即時通知するための任意機能です。

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成（既存でも可）。
2. 「APIとサービス」→「ライブラリ」で **Web Search Indexing API** を検索して有効化。
3. 「IAMと管理」→「サービスアカウント」→「サービスアカウントを作成」。
   - 名前は任意（例: `indexing-api`）。ロールは不要。
4. 作成したサービスアカウントの「キー」タブ →「鍵を追加」→「新しい鍵を作成」→ JSON を選択しダウンロード。
5. JSON内の `client_email` と `private_key` を `.env.local` に設定:

   ```text
   GOOGLE_INDEXING_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
   GOOGLE_INDEXING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

6. [Google Search Console](https://search.google.com/search-console) で対象サイトのプロパティを開き、「設定」→「ユーザーと権限」でサービスアカウントのメールアドレスを **所有者** として追加。
   （所有者権限がないとIndexing APIは403エラーになります）
7. 実行:

   ```bash
   npm run indexing:update            # 全求人ページを更新通知
   npm run indexing:delete            # 全求人ページを削除通知（募集終了時）
   node scripts/google-indexing.mts update shinagawa   # 特定エリアのみ
   ```

対象はJobPostingを実装した求人ページ（`scripts/google-indexing.mts` の `JOB_ROUTES`）のみです。会社情報ページやコラムをIndexing APIへ送信しないでください。

## コンテンツの管理場所

| 内容 | ファイル |
| --- | --- |
| 会社情報・電話番号・Instagram・住所 | `lib/site-config.ts`（1か所変更で全ページ反映） |
| 求人条件・エリア別ページの本文・エリアFAQ | `lib/jobs.ts` |
| よくある質問 | `lib/faq.ts` |
| 採用コラム記事 | `content/column/*.ts`（1記事1ファイル、`index.ts` に登録） |
| sitemapのlastmod（サイト全体） | `lib/site-config.ts` の `siteLastModified`（手動更新） |

## 計測イベント

GA4（`NEXT_PUBLIC_GA_ID`）またはGTM（`NEXT_PUBLIC_GTM_ID`）設定時に以下を送信します。未設定でもエラーになりません。ボタンには `data-event` 属性も付与済みでGTMのクリックトリガーでも拾えます。

| イベント名 | タイミング |
| --- | --- |
| `tel_click` | 電話番号クリック（place: header / hero / sticky_cta / footer 等） |
| `apply_click` | 応募ボタンクリック |
| `apply_submit` | フォーム送信試行（status: attempt）・完了ページ表示（status: complete） |
| `instagram_click` | Instagramリンククリック |
| `area_job_click` | エリア別求人カードクリック（area: slug） |
