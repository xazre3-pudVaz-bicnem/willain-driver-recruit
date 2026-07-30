# SEO監査レポート V2

対象: 株式会社ウィラン 軽貨物ドライバー採用サイト（https://www.willain.jp/）
実施日: 2026-07-30
基準: Google Search Essentials / People-first content / JobPosting・Article 構造化データガイドライン
方針: 記事・地域ページの量産ではなく、検索意図の整理・役割の明確化・独自情報の増加・Googleしごと検索の精度・応募導線の強化。

---

## 0. サマリー（今回の主な改善）

| # | 問題 | 対応 |
| --- | --- | --- |
| 1 | トップに検索語を引用符で並べた不自然文 | 自然な案内文へ書き換え（`app/page.tsx`） |
| 2 | H1が地域・職種・求人を含まず、大コピーがH1 | H1を「東京・千葉の軽貨物ドライバー求人」に。大コピーは`<p>`化（`components/home/Hero.tsx`） |
| 3 | 4エリアページで1日の流れ・研修・応募フローが重複 | 共通部を専用ページへ集約し要約＋内部リンクに（`app/jobs/[area]/page.tsx`） |
| 4 | エリア固有情報が主体不明の断定 | 「当社が把握している範囲の一般的傾向」と主体を明示。未確認は`PRE_PUBLISH_CONFIRMATION.md`へ |
| 5 | AIコラムを「採用担当が執筆・確認」と表示（実態と不一致） | AUTO/REVIEWモード＋著者表記を実態化（編集部/確認済み）。編集方針も改訂 |
| 6 | 毎日必ず公開する設計 | 品質・重複・独自性・出典・画像で判定し、公開/下書き/スキップ/エラーに分岐。品質スコア導入 |
| 7 | カテゴリーが一覧内の見出しのみ | カテゴリーハブ`/column/category/{work,contract,money,independence}`を新設（固定解説＋ItemList） |
| 8 | 求職者向けの独自機能が無い | 報酬・経費シミュレーター`/tools/reward-simulator`を新設（サーバー本文＋計算） |
| 9 | 一次情報の受け皿が無い | `data/first-party-content.ts`＋確認済みのみ表示するコンポーネントを追加 |
| 10 | 実写を区別する設計が無い | 画像データに`isGenerated`/`isActualCompanyPhoto`等を追加 |
| 11 | 業務委託なのに「入社祝金」 | 「稼働開始祝金」に変更（雇用誤認回避） |
| 12 | ソースレベルのSEO検証不足 | `seo:content` / `seo:duplicates` / `seo:jobs` を追加 |

## 1. クロール範囲・インデックス方針

- インデックス対象：トップ／求人一覧／募集中の求人詳細4／固定ページ（work・beginner・benefits・independence-support・faq・company・privacy）／E-E-A-T（recruitment-policy・editorial-policy）／コラム一覧・カテゴリーハブ・公開記事／報酬シミュレーター。
- noindex：`/apply/thanks`（応募完了）。`/apply` はインデックス可（sitemap掲載）。
- 生成エンドポイント（opengraph-image・icon・manifest・sitemap・robots・feed）は通常のインデックス対象外。

## 2. ページ役割（重複解消の考え方）

- トップ＝最上位ハブ。各下層への案内と募集条件サマリーに徹する（詳細は専用ページ）。
- 求人一覧＝4エリアの条件比較。JobPostingは付けない（ItemListのみ）。
- 求人詳細＝エリア固有の条件＋JobPosting。共通解説は専用ページへ集約。
- work/beginner/benefits/independence-support＝各テーマのピラー。
- コラム＝ピラーを補完する検索意図別の記事。カテゴリーハブがクラスタの束ね役。
- 詳細は `SEO_KEYWORD_MAP_V2.md`。

## 3. 構造化データ（現状）

| 種別 | 実装ページ |
| --- | --- |
| Organization | 全ページ（layout） |
| WebSite | トップ |
| BreadcrumbList | 全下層 |
| ItemList | 求人一覧・カテゴリーハブ |
| JobPosting | 求人詳細4のみ（一覧・トップ・コラム・シミュレーターには無し） |
| FAQPage | /faq・各エリア・/beginner（画面表示のQ&Aと一致・QAPageは不使用） |
| BlogPosting | 全コラム（articleSection・keywords・honest author を追加） |
| WebPage | エリア詳細・コラム詳細・シミュレーター |

`seo:validate` / `seo:schema` / `seo:jobs` で自動検証（error 0）。

## 4. コラム24記事の品質・重複監査（§8）

- `seo:duplicates`（総当たり比較）：タイトル0.8／見出し0.7／本文0.65のいずれの閾値も超える組み合わせ **0件**。統合・301は不要と判断。
- `seo:content`：禁止表現・架空数値・報酬不一致・HTML混入・AI表記不整合・画像欠落・関連切れ **0件**。
- 警告：`what-is-light-cargo-driver` など6記事が本文1,750〜1,955字とやや短め（下限2,000字の警告）。低品質ではないため据え置き。将来、実務の独自情報（`first-party-content`）を追記して厚みを出す候補。

## 5. Googleしごと検索（§16）

- JobPostingは4求人詳細のみ。title=職種名／CONTRACTOR／JPY・DAY／各エリア日額（画面一致）／addressCountry JP／固有identifier／directApply。
- 車両リースは応募料ではなく任意の車両準備方法である旨を本文で明記。金銭支払いを応募必須と誤認させる構造・文言なし。
- 募集終了時：`isActive=false` で一覧・ItemList・sitemap・JobPosting対象から自動除外 →（運用）`indexing:delete`。

## 6. 分類（ページごと）

| 分類 | ページ |
| --- | --- |
| 維持 | /jobs, /jobs/*, /faq, /company, /privacy, /recruitment-policy |
| 改善（今回） | /（トップ）, /jobs/*（重複削減）, /column, /column/[slug]（目次・著者表記）, /editorial-policy（AI表記） |
| 新設 | /column/category/*, /tools/reward-simulator |
| 統合・リダイレクト候補 | なし（重複0のため） |
| noindex | /apply/thanks |
| 削除候補 | なし |

URL削除・統合が発生しないため、今回の301追加はありません（正規化リダイレクトは既存の `next.config.ts` を維持）。

## 7. 未確認情報の扱い

- 事実確認できない条件・地域特徴は `PRE_PUBLISH_CONFIRMATION.md` に集約。掲載は「主体明示＋面談確認」で運用。
- 実写がない画像は必ず「〜のイメージ」。実写追加時のみ実写表記を許可（`data/column-images.ts` の `isActualPhoto`）。

## 8. 検証結果（クリーン状態）

- build 成功（83ページ）／lint 0／typecheck 0
- seo:validate 46ページ error 0 / warn 0
- seo:links 0 / seo:schema 0 / seo:content 0(warn6) / seo:duplicates 0 / seo:jobs 0
- column:validate 自己テスト OK（品質スコア92/100・publish判定）
