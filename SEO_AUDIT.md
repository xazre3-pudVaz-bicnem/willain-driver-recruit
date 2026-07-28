# SEO監査レポート（実装前の現状）

対象: 株式会社ウィラン 軽貨物ドライバー採用サイト（https://www.willain.jp/）
監査日: 2026-07-28
基準: Google Search Essentials / SEO Starter Guide / JobPosting 構造化データガイドライン

---

## 1. ルート一覧とインデックス方針

| ルート | 種別 | index | 主なSchema | 備考 |
| --- | --- | --- | --- | --- |
| `/` | 静的 | index | Organization, WebSite | ハブ（東京・千葉全体） |
| `/jobs` | 静的 | index | Organization, Breadcrumb | 求人一覧（JobPostingなし＝正） |
| `/jobs/shinagawa` | SSG | index | JobPosting, FAQPage, Breadcrumb | 品川 日額22,000円〜 |
| `/jobs/koto` | SSG | index | JobPosting, FAQPage, Breadcrumb | 江東 日額20,500円〜 |
| `/jobs/kasai` | SSG | index | JobPosting, FAQPage, Breadcrumb | 葛西・江戸川 日額20,500円〜 |
| `/jobs/funabashi` | SSG | index | JobPosting, FAQPage, Breadcrumb | 船橋 日額20,000円〜 |
| `/work` | 静的 | index | Organization, Breadcrumb | 仕事内容 |
| `/benefits` | 静的 | index | Organization, Breadcrumb | 働くメリット |
| `/beginner` | 静的 | index | Organization, Breadcrumb | 未経験の方へ |
| `/independence-support` | 静的 | index | Organization, Breadcrumb | 独立・開業サポート |
| `/faq` | 静的 | index | FAQPage, Breadcrumb | よくある質問 |
| `/company` | 静的 | index | Organization, Breadcrumb | 会社情報 |
| `/apply` | 静的 | index | Organization, Breadcrumb | 応募フォーム（indexで可） |
| `/apply/thanks` | 静的 | **noindex** | - | 送信完了（noindex・sitemap除外＝正） |
| `/column` | 静的 | index | Organization, Breadcrumb | コラム一覧 |
| `/column/[slug]` ×12 | SSG | index | Article, Breadcrumb | 採用コラム |
| `/privacy` | 静的 | index | Organization, Breadcrumb | プライバシーポリシー |
| `/sitemap.xml` `/robots.txt` `/manifest.webmanifest` | 生成 | - | - | 正常 |
| `/icon` `/apple-icon` `/opengraph-image` | 生成 | - | - | ファビコン・OG自動生成 |

全ページ **H1は1つ**、**title は全ページ固有**、**canonical あり**（本番は `https://www.willain.jp` を基点）を確認済み。

## 2. 良好な点（維持する）

- 全ページに固有 title / description / canonical（`metadataBase` 経由の絶対URL）。
- 全サブページに BreadcrumbList（画面表示と一致）。
- JobPosting は **エリア別4ページのみ**。求人一覧・トップ・コラムには無し（ガイドライン準拠）。
- JobPosting の `baseSalary.value` が各エリアの画面表示日額と**完全一致**（品川22,000／江東・葛西20,500／船橋20,000）。`employmentType: CONTRACTOR` / `JPY` / `DAY` / `addressCountry: JP` / 固有 `identifier` / `directApply: true`。
- `datePosted` は固定文字列（ビルド日で自動更新しない）。
- JSON-LD は `<` `>` `&` をエスケープした XSS セーフ出力。
- FAQPage は画面表示の Q&A と一致。
- 応募フォームはログイン不要・サーバー生成HTMLに求人条件が存在（JS無効でも読める）。
- sitemap は 27 URL（`/apply/thanks` を除外）、`lastmod` は手動管理の更新日（ビルド日時にしない）。
- robots.txt は正しく `/apply/thanks` のみ disallow、Googlebot をブロックしない。

## 3. 検出した問題（本実装で修正）

| # | 深刻度 | 問題 | 対応 |
| --- | --- | --- | --- |
| A | 高 | AI生成画像の alt が「株式会社ウィランの軽貨物ドライバー／配送車」等、実写・実車と誤認させる表現（tsx 7箇所＋jobs.ts の imageAlt 4箇所） | すべて「〜のイメージ」表現へ修正 |
| B | 中 | トップに「東京4区と、千葉・船橋。」＝東京は実際3エリア（品川・江東・葛西）で地域数が不正確 | 「東京都内3エリアと、千葉県船橋市。」へ修正 |
| C | 中 | エリア別求人からの応募リンクに `?area=` が付かず、希望エリアの自動選択が働かない（フォーム側は `searchParams.area` を読む実装済み） | CtaSection/応募リンクに `area` を引き継ぐ |
| D | 中 | 求人一覧 `/jobs` に ItemList 構造化データが無い | ItemList + Breadcrumb を追加 |
| E | 中 | Organization に contactPoint が無い | contactPoint（電話・言語）を追加 |
| F | 中 | 正式ドメイン（www.willain.jp）への正規化（非www・旧Vercelドメイン→301）が未設定 | next.config に host リダイレクトを追加、`NEXT_PUBLIC_SITE_URL` を本番URLに |
| G | 中 | GA4イベントが5種のみ（job_view / form_start / form_error / phone_click 別名 / column_to_job_click 等が不足） | イベント種別とパラメータを拡張 |
| H | 低 | 内部リンクのアンカーが「詳細を見る」等の汎用表現の箇所がある | 「品川区の軽貨物ドライバー求人を見る」等へ具体化 |
| I | 低 | E-E-A-T 用の運営者・編集方針・著者ページが無い | /editorial-policy /recruitment-policy を新設 |
| J | 低 | SEO自動検証コマンド（seo:audit等）・indexing:status が無い | scripts を追加 |
| K | 低 | 一部コピーに抽象表現（「安心してスタート」等）や「2〜3ヶ月で慣れる方が多い」等の分布断定 | 具体化・ヘッジ |

## 4. 事実確認メモ（jobs.ts / 前回ユーザー提示で確定済み）

- 契約: 業務委託 / 普通免許（AT限定可）/ 未経験歓迎 / 週3日〜相談可 / 週払い（規定あり）
- 車両: リース月額30,000円（固定）/ 持ち込み可 / 購入代行可
- 研修: 横乗り研修 / 未経験者向け研修
- 支援: 確定申告相談・税理士紹介 / 独立支援制度 / 社員登用制度
- 日額: 品川22,000円〜 / 江東20,500円〜 / 葛西・江戸川20,500円〜 / 船橋20,000円〜 / 全体20,000円〜
- 勤務時間: 7:00〜20:00頃・実働8〜10時間 / 直帰可 / 早上がり可 / 深夜配送は原則なし
- 稼働開始: 最短5日程度（経験者は最短3日）
- 所在地: 〒104-0061 東京都中央区銀座1丁目12番4号 N&E BLD.6F（※常設営業所か登記のみか要確認 → LocalBusiness は付けない）

## 5. 構造化データ方針（本実装後の目標）

- 全体: Organization（contactPoint/sameAs 追加）+ WebSite
- 求人一覧: ItemList + BreadcrumbList
- 求人詳細: JobPosting + BreadcrumbList（+ FAQPage）
- コラム: Article（BlogPosting相当。headline/author/publisher/datePublished/dateModified/image/mainEntityOfPage）+ BreadcrumbList
- FAQ: FAQPage + BreadcrumbList
- 会社情報: Organization + BreadcrumbList
- **LocalBusiness / EmploymentAgency は使用しない**（実態未確認のため。銀座住所を店舗・営業所として誤認させない）
