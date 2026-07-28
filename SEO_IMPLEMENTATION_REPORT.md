# SEO実装レポート

対象: 株式会社ウィラン 軽貨物ドライバー採用サイト（https://www.willain.jp/）
実装日: 2026-07-28
基準: Google Search Essentials / SEO Starter Guide / JobPosting 構造化データガイドライン
方針: 既存デザイン・機能を維持し、事実確認できる範囲のみ実装。順位保証や仕様外の手法は不使用。

---

## 1. 構造化データ

| 種別 | 実装ページ | 内容 |
| --- | --- | --- |
| Organization | 全ページ（layout） | name/url/logo/telephone/address に加え **contactPoint(recruitment)** を追加。LocalBusiness/EmploymentAgencyは未使用（実態未確認のため） |
| WebSite | トップ | publisher を Organization に紐付け |
| BreadcrumbList | 全下層ページ | 画面表示のパンくずと一致 |
| **ItemList** | 求人一覧 `/jobs`（新規） | 募集中エリアを position 付きで列挙（JobPostingは付けない） |
| JobPosting | 求人詳細4ページのみ | title=「軽貨物ドライバー」/ CONTRACTOR / JPY / DAY / addressCountry JP / 固有identifier / directApply / **baseSalaryは各エリアの日額（画面表示と一致）** / validThroughは未定なので未出力 |
| FAQPage | /faq・各求人ページ | 画面表示のQ&Aと一致 |
| **BlogPosting** | コラム12＋新規6記事 | Article→BlogPostingに変更。image/mainEntityOfPage/author(組織・/recruitment-policy)/publisher |

seo:schema 検証 → error 0。

## 2. Googleしごと検索の適合

- JobPosting は `/jobs/shinagawa` `/jobs/koto` `/jobs/kasai` `/jobs/funabashi` のみ。一覧・トップ・コラムには無し（seo:validateで自動検証）。
- baseSalary.value = 各エリアの日額（品川22,000／江東20,500／葛西20,500／船橋20,000）で、画面の「日額◯◯円〜」と一致。
- datePosted は固定文字列（2026-07-25）。ビルド日で自動更新しない。未来日でないことを検証。
- identifier は求人ごとに固有（重複を自動検証）。
- 募集終了運用: `isActive=false` にすると一覧・ItemList・sitemap・JobPosting対象から外れる → `indexing:delete` で通知。

## 3. ドメイン正規化・canonical

- 本番ビルドは canonical/sitemap/構造化データを **常に `https://www.willain.jp`** に固定（Vercel初期ドメインがcanonicalにならない）。
- next.config: `willain.jp`（非www）→ `www.willain.jp` を **301**。`LEGACY_VERCEL_HOST` 指定時は旧Vercelドメインも301。
- canonical はすべて絶対URL。末尾スラッシュなしで統一（trailingSlash:false）。

## 4. title / description

- 全インデックスページで title・description が固有（seo:validateで重複0を検証）。
- 対策KWに合わせて調整（例: 品川「日額22,000円〜」、仕事内容「東京・千葉の宅配求人」、独立「黒ナンバー・確定申告」）。
- description に 募集地域・契約形態・報酬・未経験可・車両・固有内容 を自然に含める。

## 5. トップページのハブ化

- ファーストビュー直後に **定義文＋募集条件サマリー（dl）** を追加（AIO・要点先出し）。
- **「目的から探す」** 検索意図別ナビ（仕事内容/未経験/報酬/エリア/独立/FAQ）。
- **テーマ別 採用コラム導線**（仕事内容/未経験/報酬と経費/車両・黒ナンバー/業務委託/独立）。
- 地域数の誤りを修正:「東京4区と、千葉・船橋。」→「東京都内3エリアと、千葉県船橋市。」（トップ・求人一覧とも）。

## 6. 内部リンク

- リンクアンカーを具体化（「詳細を見る」→「品川区の軽貨物ドライバー求人（日額22,000円〜）を見る」等、aria-labelも付与）。
- エリア求人ページに **関連ページ・関連コラム** セクション（/work /beginner /benefits /independence-support ＋ area.relatedArticles）。
- 応募CTAに `?area=slug` を引き継ぎ、応募フォームの希望エリアを自動選択（slug→エリア値を正規化）。
- すべて a要素/next-Link の href。JSのonClickだけの遷移は無し。

## 7. 画像SEO・AI画像の表記

- すべて next/image（WebP）、LCP（ヒーロー）のみ priority、他は遅延読み込み、sizes 設定済み。
- AI生成画像の alt を実写誤認しない「〜のイメージ」表現に統一（tsx・jobs.ts の imageAlt）。
- ファイル名は既に具体的（hero-driver.webp / area-shinagawa.webp / work-loading.webp 等）。
- BlogPosting.image / JobPosting.hiringOrganization.logo / og:image を設定。編集方針ページで「イメージ画像である」旨を明記。

## 8. E-E-A-T

- 新設 `/recruitment-policy`（運営者・求人掲載/更新方針・面談での最終確認・誤り修正）。
- 新設 `/editorial-policy`（著者=組織著者・一次情報参照・税務/法務は専門家確認・公開日/更新日の管理・画像の扱い）。
- BlogPosting の author を「株式会社ウィラン 採用担当」（組織著者）とし url を /recruitment-policy に。個人名は創作しない。

## 9. 計測（GA4/GTM）

- イベント拡張: job_view / area_job_click / apply_click / phone_click(tel_click) / form_start / form_submit / form_error / instagram_click / column_to_job_click / job_to_apply_click。
- パラメータ: job_id / job_area / cta_location / place / status など。
- ID未設定でもエラーにならない（trackEventはgtag/dataLayer存在時のみ送信）。

## 10. sitemap / robots

- sitemap は公開ページを自動生成（募集中エリアのみ・/apply/thanks除外）。lastmod は手動管理の更新日（ビルド日時にしない）。
- E-E-A-Tページ（recruitment-policy/editorial-policy）を追加。
- robots.txt は Googlebot をブロックせず、正式ドメインの sitemap を記載。noindexは meta robots（/apply/thanks）で制御。

## 11. 検証スクリプト（新規）

`scripts/seo-check.mjs` + npm scripts:
- `seo:audit` 全ページの title/description一覧＋問題レポート
- `seo:validate` NGで exit 1（title/desc固有・canonical・H1=1・alt・リンク切れ・空href・一覧JobPostingなし・詳細JobPosting・報酬一致・identifier重複・datePosted未来日・localhost/vercel残留・ダミーテキスト）
- `seo:links` 内部リンク切れ・空href
- `seo:schema` 構造化データ

Indexing: `indexing:update` / `indexing:delete` / `indexing:status`（求人ページ限定）。

## 11b. 追加強化（第2〜5弾）

- **JobPosting充実**: occupationalCategory / industry / workHours / responsibilities / qualifications / jobBenefits / incentiveCompensation を追加。experienceRequirements.monthsOfExperience=0 で未経験歓迎をGoogle認識形式に（すべて画面表示と一致）。
- **固有OG画像**: `app/jobs/[area]/opengraph-image.tsx`（エリア名＋日額＋条件）、`app/column/[slug]/opengraph-image.tsx`（記事タイトル＋カテゴリ）を動的生成。og:image / twitter:image / BlogPosting.image / primaryImageOfPage に反映（使い回し解消）。
- **画像サイトマップ**: 求人＝エリア画像、コラム＝固有OG、トップ＝ヒーローを images 付与。
- **構造化データ追加**: /beginner に FAQPage、/column に Blog、エリア・コラム詳細に WebPage（primaryImageOfPage）。
- **採用コラムを24記事に拡大**（新規12記事・すべて2,500字以上・比較表・BlogPosting・固有OG・内部リンク・専門家確認note）。
- **パフォーマンス**: 解析ドメイン（googletagmanager / google-analytics）へ preconnect / dns-prefetch（設定時のみ）。

## 12. 検証結果

- `npm run build` 成功（全ページ生成）
- `npm run lint` エラー0
- `npm run typecheck` エラー0
- `npm run seo:validate` **error 0 / warn 0**（30ページ）
- Rich Results Test は公開後に各求人URLで実施（SEO_OFFSITE_CHECKLIST参照）

## 13. 公開前に株式会社ウィランへ確認すべき事項

- 本社所在地（銀座）が常設営業所か登記のみか（LocalBusiness/地図/営業時間は付けていない）。
- Indeed等との条件統一（日額・勤務時間・リース料・勤務日数）。
- 実写素材（社員・研修・車両）の提供可否、実在ドライバーインタビューの可否。
- 求人の実際の初回公開日（datePosted）と、募集期限（validThrough）の有無。

## 14. 今後3か月のコンテンツ計画（低品質量産は避ける）

- 1か月目: 新規6記事の反応（GSCのクエリ/表示回数）を見て、内部リンクを微調整。
- 2か月目: 「ガソリン代は誰が負担」「軽貨物と宅配便ドライバーの違い」「週3日から働ける」「40代50代から」から2〜3本。
- 3か月目: 「インボイス制度」「開業届と青色申告」「配送アプリの基本」「宅配ボックス・置き配・再配達」から2〜3本。実写素材が入手できればエリアページ・コラムに反映。
- 地域特化記事（品川/江東/葛西/船橋で探す際の確認事項）は、エリアページと内容が重複しない固有情報を確保できる場合のみ作成。
