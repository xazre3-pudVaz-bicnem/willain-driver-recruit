# SEOキーワードマップ（ページ × 検索意図 × 内部リンク）

各ページの役割を分け、同一キーワードで自ページ同士が競合（カニバリゼーション）しないように整理する。
キーワードは本文・見出し・title・内部リンクに自然に配置し、不自然な連呼はしない。

| ページ | メインKW | 補助KW | 検索意図 | 主な誘導先 | canonical |
| --- | --- | --- | --- | --- | --- |
| `/` トップ | 東京 軽貨物ドライバー 求人 / 軽貨物ドライバー 東京 | 東京 千葉 軽貨物ドライバー / 軽貨物 業務委託 東京 | 全体像を知りハブから各詳細へ | 求人一覧・仕事内容・未経験・各エリア | `/` |
| `/jobs` 求人一覧 | 軽貨物ドライバー 求人 東京 / 求人 千葉 | 軽貨物 求人一覧 / 配送ドライバー 求人 東京 | エリア横断で比較 | 各エリア求人詳細 | `/jobs` |
| `/jobs/shinagawa` | 品川区 軽貨物ドライバー 求人 | 品川 軽貨物 求人 / 品川区 配送ドライバー 求人 / 品川区 業務委託ドライバー | 品川で応募検討 | 応募（?area=shinagawa）・仕事内容・関連コラム | `/jobs/shinagawa` |
| `/jobs/koto` | 江東区 軽貨物ドライバー 求人 | 江東区 軽貨物 求人 / 江東区 配送ドライバー 求人 | 江東で応募検討 | 応募（?area=koto）・関連コラム | `/jobs/koto` |
| `/jobs/kasai` | 葛西 軽貨物ドライバー 求人 / 江戸川区 軽貨物ドライバー 求人 | 江戸川区 軽貨物 求人 / 葛西 配送ドライバー 求人 | 葛西・江戸川で応募検討 | 応募（?area=kasai）・関連コラム | `/jobs/kasai` |
| `/jobs/funabashi` | 船橋市 軽貨物ドライバー 求人 | 船橋 軽貨物 求人 / 千葉 軽貨物ドライバー 求人 | 船橋・千葉で応募検討 | 応募（?area=funabashi）・関連コラム | `/jobs/funabashi` |
| `/work` 仕事内容 | 軽貨物ドライバー 仕事内容 | 宅配ドライバー 仕事内容 / Amazon 配送ドライバー 仕事内容 / 軽貨物 1日の流れ | 仕事内容を知る | 未経験・求人一覧 | `/work` |
| `/beginner` 未経験 | 軽貨物ドライバー 未経験 | 軽貨物 未経験 東京 / AT限定 軽貨物ドライバー / 車なし 軽貨物ドライバー | 未経験の始め方 | 求人一覧・start-from-beginner記事 | `/beginner` |
| `/benefits` 働くメリット | 軽貨物 日額保証 / 軽貨物 週払い | 軽貨物 車両リース / 業務委託ドライバー 報酬 | 報酬・待遇を比較 | 報酬例・求人一覧・daily-guarantee記事 | `/benefits` |
| `/independence-support` 独立支援 | 軽貨物 独立 / 軽貨物 開業 | 軽貨物 個人事業主 / 軽貨物 黒ナンバー / 軽貨物 確定申告 | 独立・開業を検討 | independence-guide・tax-return・black-number記事 | `/independence-support` |
| `/faq` FAQ | 軽貨物ドライバー よくある質問 | 軽貨物 未経験 質問 / 軽貨物 車両 質問 | 疑問解消 | 各求人・応募 | `/faq` |
| `/company` 会社情報 | 株式会社ウィラン 会社情報 | ウィラン 軽貨物 | 運営者確認 | 求人一覧・掲載方針 | `/company` |
| `/column` コラム一覧 | 軽貨物ドライバー コラム | 軽貨物 知識 | テーマ別に学ぶ | 各コラム | `/column` |
| `/column/[slug]` | 記事固有KW（下記） | - | 情報収集 | 関連求人1＋関連コラム2〜4＋仕事内容/未経験 | 各記事URL |
| `/recruitment-policy` | - | - | E-E-A-T（運営者・掲載方針） | 会社情報・応募 | `/recruitment-policy` |
| `/editorial-policy` | - | - | E-E-A-T（編集方針） | 掲載方針 | `/editorial-policy` |
| `/apply` 応募フォーム | 軽貨物ドライバー 応募 | - | 応募（indexで可） | - | `/apply` |
| `/apply/thanks` | - | - | 送信完了（**noindex**） | - | - |

## コラム記事の役割（重複回避）

| slug | メインKW | 検索意図 | 誘導 |
| --- | --- | --- | --- |
| what-is-light-cargo-driver | 軽貨物ドライバー 仕事内容とは | 定義・種類 | /work, /jobs |
| gyomu-itaku-basics | 軽貨物 業務委託とは | 雇用との違い | /benefits, /jobs |
| start-from-beginner | 軽貨物 未経験 始め方 | 開始手順 | /beginner, /jobs |
| license-requirements | 軽貨物 普通免許 AT限定 | 免許要件 | /beginner |
| vehicle-lease-vs-own | 軽貨物 車両リース 持ち込み | 車両選び | /benefits, /jobs |
| daily-guarantee-vs-piecework | 軽貨物 日額保証 出来高 | 報酬体系 | /benefits |
| driver-daily-schedule | 軽貨物 1日の流れ | 働き方 | /work |
| weekly-payment-jobs | 軽貨物 週払い | 支払い | /benefits |
| tokyo-driver-checklist | 東京 軽貨物 確認事項 | 東京で働く前 | 各エリア求人 |
| tax-return-basics | 軽貨物 確定申告 | 税務基礎 | /independence-support |
| independence-guide | 軽貨物 独立 開業 | 独立手順 | /independence-support |
| interview-checklist | 軽貨物 面談 確認 | 面談準備 | /apply, /jobs |
| **tokyo-job-comparison**（新規） | 東京 軽貨物 求人 比較 | 求人の選び方 | /jobs |
| **black-number-basics**（新規） | 黒ナンバーとは | 開業前基礎 | /independence-support |
| **take-home-and-expenses**（新規） | 軽貨物 手取り 経費 | 収支の考え方 | /benefits |
| **insurance-basics**（新規） | 軽貨物 任意保険 貨物保険 | 保険の考え方 | /jobs |
| **suited-or-not**（新規） | 軽貨物 向いている人 | 適性判断 | /beginner |
| **women-drivers**（新規） | 軽貨物 女性 | 属性別の始めやすさ | /beginner |

## カニバリゼーション対策

- 「東京 軽貨物ドライバー 求人」= トップ（ハブ）が主。求人一覧は「一覧・比較」、各エリアは地域名付きで差別化。
- 「軽貨物 日額保証／週払い」= /benefits が主。関連コラム（daily-guarantee / weekly-payment）は解説役に徹し、内部リンクで /benefits へ集約。
- 「軽貨物 未経験」= /beginner が主。start-from-beginner 記事は手順の詳細解説として補完。
- 「軽貨物 独立／確定申告」= /independence-support が主。independence-guide / tax-return / black-number 記事が解説役。
- 同一検索意図の記事が増えた場合は、統合・301・内部リンク集約・title/H1差別化で対応（現時点では重複なし）。
