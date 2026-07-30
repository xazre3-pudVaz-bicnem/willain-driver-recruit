# Search Console でのチェック（人間が行う作業）

コードだけでは実行できない、Google Search Console（GSC）側の作業一覧です。

## 初期設定
- [ ] ドメインプロパティ `willain.jp` を追加し所有権を確認（DNS）。www/非wwwを1つのプロパティで見る。
- [ ] サイトマップ送信：`https://www.willain.jp/sitemap.xml`
- [ ] （任意）Bing Webmaster Tools にも登録・sitemap送信。

## インデックス
- [ ] 主要ページのURL検査：`/`, `/jobs`, `/jobs/shinagawa|koto|kasai|funabashi`, `/work`, `/beginner`, `/benefits`, `/independence-support`, `/tools/reward-simulator`, `/column`, 新設カテゴリーハブ4。
- [ ] 「ページのインデックス登録」レポートで、クロール済み-未登録／検出-未登録／重複（正規URLの選択）を確認。
- [ ] canonicalがGoogle選択と一致しているか（重複時）。

## 求人（Googleしごと検索）
- [ ] 「求人情報」レポート（あれば）でJobPostingのエラー/警告を確認。
- [ ] リッチリザルトテストで4求人URLを個別に検証（title・baseSalary・datePosted・場所）。
- [ ] 募集終了時：`isActive=false`にしてデプロイ後、該当URLが求人リッチリザルトから外れるか確認。

## パフォーマンス・体験
- [ ] Core Web Vitals（モバイル/PC）とモバイルユーザビリティを確認。
- [ ] 検索パフォーマンス：クエリ別・ページ別の表示回数/クリック/CTR/平均掲載順位。
- [ ] 手動による対策・セキュリティの問題が無いか。

## 順位が低いページの改善（記事の量産で解決しない）
低順位ページは、まず以下を点検する。
- [ ] 検索意図とページ内容が合っているか（`SEO_KEYWORD_MAP_V2.md`）。
- [ ] タイトルが具体的で分かりやすいか（詰め込みでないか）。
- [ ] 一般論だけになっていないか（独自情報＝`data/first-party-content.ts` を追記）。
- [ ] 内部リンク（親カテゴリ・関連求人・関連記事）が十分か。
- [ ] 応募者が必要とする条件（報酬・勤務・車両）が明確か。
- [ ] 競合より具体的か。実際の経験・確認済み情報が入っているか。
