# SEO オフサイト・人的作業チェックリスト

コードだけでは完了できない、公開後に人が行う作業をまとめる。
正式ドメイン: https://www.willain.jp/

## 1. Google Search Console（必須）

- [ ] ドメインプロパティ `willain.jp` を登録（DNS TXT で所有権確認）。または URL プレフィックス `https://www.willain.jp/`。
- [ ] 所有権確認後、`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` に content 値を設定して再デプロイ（メタタグ確認も併用可）。
- [ ] サイトマップ送信: `https://www.willain.jp/sitemap.xml`
- [ ] URL 検査ツールでトップ・各求人ページのインデックス登録をリクエスト。
- [ ] 「求人情報」レポートで JobPosting のエラー/警告を確認。
- [ ] 「拡張」→ パンくず・FAQ・JobPosting の有効数を確認。
- [ ] 「エクスペリエンス」→ Core Web Vitals（モバイル/PC）を確認。
- [ ] 検索パフォーマンスで クエリ/ページ/国/デバイス を定点観測。
- [ ] 「手動による対策」「セキュリティの問題」に指摘がないか確認。

## 2. Googleしごと検索（Google for Jobs）

- [ ] Rich Results Test（https://search.google.com/test/rich-results）で各求人URLを検証。
      - /jobs/shinagawa /jobs/koto /jobs/kasai /jobs/funabashi
      - baseSalary が画面の日額と一致していること、title が「軽貨物ドライバー」のみであることを確認。
- [ ] 求人一覧 /jobs に JobPosting が付いていないことを確認（ItemList のみ）。
- [ ] 募集終了時: 該当エリアの `isActive` を false にしてデプロイ → `npm run indexing:delete -- <slug>`。

## 3. Google Indexing API（求人ページ限定）

- [ ] Google Cloud でサービスアカウント作成 → Search Console に「所有者」として追加（手順は README）。
- [ ] 求人更新時: `npm run indexing:update`（全求人）/ `npm run indexing:update -- shinagawa`（個別）。
- [ ] 求人終了時: `npm run indexing:delete`。
- [ ] 状況確認: `npm run indexing:status`。
- [ ] ※ Indexing API は JobPosting のある求人ページのみ。トップ・コラム・FAQ には使わない。

## 4. Bing Webmaster Tools

- [ ] サイト登録・所有権確認 → `NEXT_PUBLIC_BING_SITE_VERIFICATION` を設定して再デプロイ。
- [ ] サイトマップ送信。

## 5. ドメイン・技術

- [ ] 独自ドメイン `www.willain.jp` を Vercel に接続、`willain.jp`（非www）→ www へ301（Vercel Domains 設定 or next.config の host リダイレクト）。
- [ ] 旧 Vercel ドメインを使っていた場合、`LEGACY_VERCEL_HOST` を設定して 301（検索対象化を防ぐ）。
- [ ] HTTPS 強制（Vercel は既定で有効）。
- [ ] 応募通知メール（Resend）を設定: `RESEND_API_KEY` / `APPLICATION_TO_EMAIL` / `APPLICATION_FROM_EMAIL`。
- [ ] GA4 または GTM の ID を設定: `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID`。

## 6. NAP（名称・住所・電話）の統一

- [ ] 会社名「株式会社ウィラン」、電話「080-7297-3908」、所在地を、採用サイト・Indeed・Instagram・他求人媒体で完全一致させる。
- [ ] Indeed の求人条件（日額・勤務時間・車両リース料など）を本サイトと統一する。
      - 現在の設定: 日額（品川22,000円〜/江東20,500円〜/葛西20,500円〜/船橋20,000円〜）、リース月額30,000円、勤務7:00〜20:00頃・実働8〜10時間、週3日〜。
- [ ] Instagram（@willain_official）のプロフィールから採用サイト（www.willain.jp）へリンク。
- [ ] 会社SNSの投稿から各エリア求人ページへリンク（例: 品川の募集告知 → /jobs/shinagawa）。

## 7. コンテンツ・信頼性（実写・一次情報）

- [ ] 実在ドライバー・研修・車両の写真を撮影して差し替え（現在はAI生成のイメージ画像）。
      差し替え後は alt を「〜のイメージ」から実態に合わせて修正。
- [ ] 実在ドライバーへのインタビューを実施できれば、体験談として掲載（氏名・写真は本人同意のうえ）。
- [ ] 採用活動に関する正規のプレスリリース・外部掲載があれば sameAs / 参照に追加。

## 8. 禁止事項（実施しない）

- 被リンクの購入、相互リンク集への大量登録、自動生成の外部ブログ、コメントスパム。
- 無関係な地域ページの量産、求人媒体の偽アカウント、架空の口コミ・体験談。
- 検索順位を保証するサービスの利用。
- 隠しテキスト・クローキング（表示とHTMLで内容を変える）。
