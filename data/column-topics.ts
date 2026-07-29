/**
 * 採用コラムのテーマキュー。
 *
 * 完全ランダムではなく、未使用テーマを上から順に消化する。
 * 各テーマには「対策キーワード」「検索意図」を持たせ、既存記事とカニバらないよう
 * generator 側で重複判定してからスキップ／採用を決める。
 *
 * slugHint は生成記事のURL・ファイル名に使う固定スラッグ（Claudeには生成させない）。
 * needsSources=true のテーマは、sourceIds に登録された公式出典が揃っている場合のみ生成する。
 */

import type { ColumnCategory } from "@/lib/column";
import type { ColumnImageCategory } from "@/data/column-images";

export type ColumnTopic = {
  /** 安定ID（履歴・ログの照合に使用） */
  id: string;
  /** 想定タイトル（Claudeが自然に調整してよい） */
  title: string;
  /** 生成記事の固定スラッグ */
  slugHint: string;
  /** 4分類（記事の category に入る値） */
  category: ColumnCategory;
  /** 12分類の細目（表示・履歴の内部ラベル） */
  theme: string;
  /** メインキーワード（カニバリ判定の主軸） */
  mainKeyword: string;
  /** サブキーワード */
  subKeywords: string[];
  /** 検索意図 */
  searchIntent: string;
  /** アイキャッチの優先カテゴリ */
  imageCategory: ColumnImageCategory;
  /** 制度テーマ（公式出典が必須） */
  needsSources: boolean;
  /** 必須出典ID（official-sources） */
  sourceIds: string[];
  /** 特に関連する募集エリアのslug（任意・記事内リンクの優先に使う） */
  area?: string;
};

export const columnTopics: ColumnTopic[] = [
  // 1. 仕事内容
  { id: "job-overview", title: "軽貨物ドライバーの仕事内容とは", slugHint: "light-cargo-job-overview", category: "仕事内容", theme: "軽貨物ドライバーの仕事内容", mainKeyword: "軽貨物ドライバー 仕事内容", subKeywords: ["軽貨物 一日", "宅配 業務委託"], searchIntent: "軽貨物ドライバーが実際にどんな作業をするのかを知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 2. 未経験者向け
  { id: "beginner-steps", title: "未経験から軽貨物ドライバーを始める流れ", slugHint: "beginner-start-steps", category: "仕事内容", theme: "未経験者向け", mainKeyword: "軽貨物ドライバー 未経験 始め方", subKeywords: ["軽貨物 未経験 流れ", "宅配 未経験"], searchIntent: "未経験者が応募から稼働までどう進むのかを知りたい", imageCategory: "training", needsSources: false, sourceIds: [] },
  // 3. 研修
  { id: "ride-along", title: "軽貨物ドライバーの横乗り研修とは", slugHint: "ride-along-training", category: "仕事内容", theme: "研修・仕事の覚え方", mainKeyword: "軽貨物 横乗り研修", subKeywords: ["軽貨物 研修 内容", "宅配 研修"], searchIntent: "横乗り研修で何を教わるのか、期間はどれくらいかを知りたい", imageCategory: "training", needsSources: false, sourceIds: [] },
  // 4. 配送実務
  { id: "delivery-app", title: "軽貨物ドライバーが使う配送アプリの基本", slugHint: "delivery-app-basics", category: "仕事内容", theme: "配送実務", mainKeyword: "軽貨物 配送アプリ 使い方", subKeywords: ["配送アプリ 基本", "宅配 アプリ"], searchIntent: "配送アプリでどんな操作をするのか、使いこなせるか不安を解消したい", imageCategory: "delivery", needsSources: false, sourceIds: [] },
  // 5. 配送実務
  { id: "loading", title: "軽貨物ドライバーの荷物の積み方の基本", slugHint: "how-to-load-parcels", category: "仕事内容", theme: "配送実務", mainKeyword: "軽貨物 荷物 積み方", subKeywords: ["軽バン 積載", "配送 効率 積み込み"], searchIntent: "効率よく安全に荷物を積むコツを知りたい", imageCategory: "cargo", needsSources: false, sourceIds: [] },
  // 6. 配送実務
  { id: "redelivery", title: "軽貨物ドライバーの再配達対応の基本", slugHint: "redelivery-handling", category: "仕事内容", theme: "配送実務", mainKeyword: "軽貨物 再配達", subKeywords: ["再配達 減らす", "不在 対応"], searchIntent: "再配達がどのくらい発生し、どう対応・削減するのかを知りたい", imageCategory: "delivery", needsSources: false, sourceIds: [] },
  // 7. 配送実務
  { id: "okihai", title: "置き配と宅配ボックスの基本", slugHint: "okihai-and-delivery-box", category: "仕事内容", theme: "配送実務", mainKeyword: "置き配 宅配ボックス", subKeywords: ["置き配 ルール", "宅配ボックス 使い方"], searchIntent: "置き配や宅配ボックスの扱い・注意点を知りたい", imageCategory: "delivery", needsSources: false, sourceIds: [] },
  // 8. 報酬
  { id: "daily-guarantee", title: "軽貨物ドライバーの日額保証とは", slugHint: "daily-guarantee-explained", category: "お金・報酬", theme: "報酬・経費", mainKeyword: "軽貨物 日額保証", subKeywords: ["日給保証 軽貨物", "報酬 保証 仕組み"], searchIntent: "日額保証がどういう仕組みで、条件は何かを知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 9. 報酬
  { id: "pay-vs-takehome", title: "軽貨物ドライバーの報酬と手取りの違い", slugHint: "pay-vs-takehome", category: "お金・報酬", theme: "報酬・経費", mainKeyword: "軽貨物 手取り", subKeywords: ["業務委託 手取り", "報酬 経費 違い"], searchIntent: "提示される報酬と実際の手取りがどう違うのかを知りたい", imageCategory: "delivery", needsSources: false, sourceIds: [] },
  // 10. 報酬
  { id: "expenses", title: "軽貨物ドライバーに必要な経費", slugHint: "necessary-expenses", category: "お金・報酬", theme: "報酬・経費", mainKeyword: "軽貨物 経費", subKeywords: ["軽貨物 必要経費", "業務委託 経費"], searchIntent: "自分で負担する経費にどんなものがあるかを知りたい", imageCategory: "cargo", needsSources: false, sourceIds: [] },
  // 11. 報酬
  { id: "gasoline", title: "軽貨物ドライバーのガソリン代の考え方", slugHint: "gasoline-cost-guide", category: "お金・報酬", theme: "報酬・経費", mainKeyword: "軽貨物 ガソリン代", subKeywords: ["軽貨物 燃料費", "配送 ガソリン 負担"], searchIntent: "ガソリン代は誰が負担し、月いくらくらいかの目安を知りたい", imageCategory: "van", needsSources: false, sourceIds: [] },
  // 12. 車両・リース
  { id: "lease-checkpoints", title: "軽貨物の車両リースで確認する項目", slugHint: "vehicle-lease-checkpoints", category: "働き方・契約", theme: "車両・リース", mainKeyword: "軽貨物 車両リース 確認", subKeywords: ["軽バン リース 料金", "リース 契約 期間"], searchIntent: "車両リースを使う前に料金・保険・契約期間など何を確認すべきかを知りたい", imageCategory: "van", needsSources: false, sourceIds: [] },
  // 13. 車両
  { id: "no-car", title: "車を持っていなくても軽貨物ドライバーを始められるか", slugHint: "start-without-own-car", category: "働き方・契約", theme: "車両・リース", mainKeyword: "軽貨物 車なし", subKeywords: ["軽貨物 車 持っていない", "リース 車両 用意"], searchIntent: "自分の車がなくても始められるのか、方法を知りたい", imageCategory: "van", needsSources: false, sourceIds: [] },
  // 14. 車両
  { id: "lease-vs-own", title: "車両持ち込みと車両リースの違い", slugHint: "lease-vs-bring-your-own", category: "働き方・契約", theme: "車両・リース", mainKeyword: "軽貨物 持ち込み リース 違い", subKeywords: ["車両持ち込み メリット", "リース デメリット"], searchIntent: "自分の車を使う場合とリースを使う場合の違い・向き不向きを知りたい", imageCategory: "van", needsSources: false, sourceIds: [] },
  // 15. 業務委託
  { id: "gyomu-itaku", title: "軽貨物ドライバーの業務委託契約とは", slugHint: "gyomu-itaku-explained", category: "働き方・契約", theme: "業務委託", mainKeyword: "軽貨物 業務委託 とは", subKeywords: ["業務委託 雇用 違い", "個人事業主 配送"], searchIntent: "業務委託が雇用と何が違うのか、基本の仕組みを知りたい", imageCategory: "apply", needsSources: true, sourceIds: ["jftc", "mhlw"] },
  // 16. 業務委託
  { id: "contract-points", title: "業務委託契約書で確認する項目", slugHint: "contract-check-points", category: "働き方・契約", theme: "業務委託", mainKeyword: "軽貨物 業務委託 契約書 確認", subKeywords: ["契約書 チェック", "報酬 支払い 契約"], searchIntent: "契約書のどこを確認すればトラブルを避けられるかを知りたい", imageCategory: "apply", needsSources: true, sourceIds: ["jftc", "mhlw"] },
  // 17. 免許
  { id: "license", title: "軽貨物ドライバーに必要な普通免許", slugHint: "required-drivers-license", category: "働き方・契約", theme: "業務委託", mainKeyword: "軽貨物 必要な免許", subKeywords: ["軽貨物 普通免許", "配送 免許 種類"], searchIntent: "どの免許があれば軽貨物ドライバーになれるのかを知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 18. 免許
  { id: "at-license", title: "AT限定免許で軽貨物ドライバーになれるか", slugHint: "at-limited-license", category: "働き方・契約", theme: "業務委託", mainKeyword: "軽貨物 AT限定", subKeywords: ["AT限定 配送", "軽バン AT"], searchIntent: "AT限定免許でも軽貨物ドライバーとして働けるのかを知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 19. 黒ナンバー・開業準備
  { id: "black-number", title: "黒ナンバーとは何かをわかりやすく解説", slugHint: "what-is-black-number", category: "独立・キャリア", theme: "黒ナンバー・開業準備", mainKeyword: "黒ナンバー とは", subKeywords: ["事業用軽自動車", "貨物軽自動車運送事業 届出"], searchIntent: "黒ナンバーの意味・取得の流れの概要を知りたい", imageCategory: "van", needsSources: true, sourceIds: ["mlit", "unyu", "egov"] },
  // 20. 開業準備
  { id: "business-registration", title: "軽貨物ドライバーの開業届の基本", slugHint: "business-registration-guide", category: "独立・キャリア", theme: "黒ナンバー・開業準備", mainKeyword: "軽貨物 開業届", subKeywords: ["個人事業主 開業届", "開業届 出し方"], searchIntent: "開業届とは何か、いつ・どこに出すのかの概要を知りたい", imageCategory: "apply", needsSources: true, sourceIds: ["nta"] },
  // 21. 独立・確定申告
  { id: "blue-return", title: "軽貨物ドライバーの青色申告の基本", slugHint: "blue-return-guide", category: "独立・キャリア", theme: "独立・確定申告", mainKeyword: "軽貨物 青色申告", subKeywords: ["青色申告 個人事業主", "確定申告 青色 白色"], searchIntent: "青色申告とは何か、白色との違いの概要を知りたい", imageCategory: "apply", needsSources: true, sourceIds: ["nta"] },
  // 22. 独立・確定申告
  { id: "invoice", title: "軽貨物ドライバーとインボイス制度", slugHint: "invoice-system-guide", category: "独立・キャリア", theme: "独立・確定申告", mainKeyword: "軽貨物 インボイス", subKeywords: ["インボイス 個人事業主", "適格請求書 配送"], searchIntent: "インボイス制度が軽貨物の業務委託にどう関係するのかの概要を知りたい", imageCategory: "apply", needsSources: true, sourceIds: ["nta", "invoice"] },
  // 23. 保険
  { id: "voluntary-insurance", title: "軽貨物ドライバーの任意保険の基本", slugHint: "voluntary-insurance", category: "働き方・契約", theme: "業務委託", mainKeyword: "軽貨物 任意保険", subKeywords: ["事業用 任意保険", "軽貨物 保険 選び方"], searchIntent: "業務で使う軽バンの任意保険はどう考えればよいかを知りたい", imageCategory: "van", needsSources: true, sourceIds: ["mlit"] },
  // 24. 保険
  { id: "cargo-insurance", title: "貨物保険を確認するときのポイント", slugHint: "cargo-insurance-points", category: "働き方・契約", theme: "業務委託", mainKeyword: "軽貨物 貨物保険", subKeywords: ["貨物保険 とは", "運送 保険 補償"], searchIntent: "荷物への補償（貨物保険）の考え方・確認点を知りたい", imageCategory: "cargo", needsSources: true, sourceIds: ["mlit"] },
  // 25. 働き方
  { id: "work-3days", title: "軽貨物ドライバーは週3日から働けるか", slugHint: "work-3-days-guide", category: "働き方・契約", theme: "働き方", mainKeyword: "軽貨物 週3", subKeywords: ["軽貨物 週3日", "配送 掛け持ち"], searchIntent: "週3日など少ない日数から働けるのかを知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 26. 働き方
  { id: "side-job", title: "軽貨物の副業を始める前に確認すること", slugHint: "side-job-checklist", category: "働き方・契約", theme: "働き方", mainKeyword: "軽貨物 副業", subKeywords: ["軽貨物 副業 確定申告", "副業 配送 注意"], searchIntent: "副業として軽貨物を始める前の注意点を知りたい", imageCategory: "delivery", needsSources: false, sourceIds: [] },
  // 27. 働き方
  { id: "suited", title: "軽貨物ドライバーに向いている人の特徴", slugHint: "suited-people", category: "仕事内容", theme: "働き方", mainKeyword: "軽貨物 向いている人", subKeywords: ["軽貨物 適性", "配送 向き不向き"], searchIntent: "自分が軽貨物ドライバーに向いているか判断したい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 28. 働き方
  { id: "not-suited", title: "軽貨物ドライバーに向いていない人の特徴", slugHint: "not-suited-people", category: "仕事内容", theme: "働き方", mainKeyword: "軽貨物 向いていない人", subKeywords: ["軽貨物 きつい", "配送 続かない"], searchIntent: "向いていないタイプや続かない人の傾向を知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 29. 働き方
  { id: "age-40-50", title: "軽貨物ドライバーは40代・50代から始められるか", slugHint: "start-at-40s-50s", category: "働き方・契約", theme: "働き方", mainKeyword: "軽貨物 40代 50代", subKeywords: ["軽貨物 年齢", "中高年 配送 転職"], searchIntent: "40代・50代からでも始められるのか、続けられるのかを知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 30. 働き方
  { id: "women", title: "女性が軽貨物ドライバーを始める際の確認事項", slugHint: "women-driver-checklist", category: "働き方・契約", theme: "働き方", mainKeyword: "軽貨物 女性", subKeywords: ["女性ドライバー 配送", "軽貨物 女性 働き方"], searchIntent: "女性が軽貨物で働く際の環境や確認点を知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 31. 応募・面談
  { id: "interview", title: "軽貨物ドライバーの面談で確認すること", slugHint: "interview-check-points", category: "働き方・契約", theme: "応募・面談", mainKeyword: "軽貨物 面談 確認", subKeywords: ["軽貨物 面接 質問", "業務委託 面談"], searchIntent: "面談でどんな点を確認・質問すべきかを知りたい", imageCategory: "apply", needsSources: false, sourceIds: [] },
  // 32. 応募・面談
  { id: "compare-jobs", title: "軽貨物求人を比較するときのポイント", slugHint: "compare-job-listings", category: "働き方・契約", theme: "応募・面談", mainKeyword: "軽貨物 求人 比較", subKeywords: ["軽貨物 求人 選び方", "宅配 求人 見極め"], searchIntent: "複数の軽貨物求人をどう比較すればよいかを知りたい", imageCategory: "city", needsSources: false, sourceIds: [] },
  // 33. 地域別
  { id: "tokyo-search", title: "東京で軽貨物ドライバー求人を探す際の確認事項", slugHint: "tokyo-job-search-guide", category: "仕事内容", theme: "地域別求人", mainKeyword: "東京 軽貨物 求人 探し方", subKeywords: ["東京 軽貨物 ドライバー", "都内 宅配 求人"], searchIntent: "東京で軽貨物求人を探すときに確認すべき点を知りたい", imageCategory: "city", needsSources: false, sourceIds: [] },
  // 34. 地域別（品川）
  { id: "shinagawa-search", title: "品川区で軽貨物ドライバー求人を探す際の確認事項", slugHint: "shinagawa-job-guide", category: "仕事内容", theme: "地域別求人", mainKeyword: "品川区 軽貨物 求人", subKeywords: ["品川 宅配 ドライバー", "品川区 配送 業務委託"], searchIntent: "品川区で軽貨物求人を探すときの地域事情と確認点を知りたい", imageCategory: "city", needsSources: false, sourceIds: [], area: "shinagawa" },
  // 35. 地域別（江東）
  { id: "koto-search", title: "江東区で軽貨物ドライバー求人を探す際の確認事項", slugHint: "koto-job-guide", category: "仕事内容", theme: "地域別求人", mainKeyword: "江東区 軽貨物 求人", subKeywords: ["江東区 宅配", "豊洲 亀戸 配送"], searchIntent: "江東区で軽貨物求人を探すときの地域事情と確認点を知りたい", imageCategory: "city", needsSources: false, sourceIds: [], area: "koto" },
  // 36. 地域別（葛西）
  { id: "kasai-search", title: "葛西・江戸川区で軽貨物求人を探す際の確認事項", slugHint: "kasai-job-guide", category: "仕事内容", theme: "地域別求人", mainKeyword: "江戸川区 軽貨物 求人", subKeywords: ["葛西 宅配", "江戸川区 配送 業務委託"], searchIntent: "葛西・江戸川区で軽貨物求人を探すときの地域事情と確認点を知りたい", imageCategory: "city", needsSources: false, sourceIds: [], area: "kasai" },
  // 37. 地域別（船橋）
  { id: "funabashi-search", title: "船橋市で軽貨物ドライバー求人を探す際の確認事項", slugHint: "funabashi-job-guide", category: "仕事内容", theme: "地域別求人", mainKeyword: "船橋市 軽貨物 求人", subKeywords: ["船橋 宅配", "千葉 配送 業務委託"], searchIntent: "船橋市で軽貨物求人を探すときの地域事情と確認点を知りたい", imageCategory: "city", needsSources: false, sourceIds: [], area: "funabashi" },
  // 38. 独立
  { id: "independence-path", title: "軽貨物ドライバーから独立するまでの流れ", slugHint: "path-to-independence", category: "独立・キャリア", theme: "独立・確定申告", mainKeyword: "軽貨物 独立", subKeywords: ["軽貨物 個人事業主 独立", "配送 独立 流れ"], searchIntent: "軽貨物ドライバーとして独立するまでの一般的な流れを知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
  // 39. 独立
  { id: "incorporation", title: "軽貨物ドライバーが法人化を考えるタイミング", slugHint: "incorporation-timing", category: "独立・キャリア", theme: "独立・確定申告", mainKeyword: "軽貨物 法人化", subKeywords: ["個人事業主 法人化", "配送 法人 タイミング"], searchIntent: "個人から法人化を検討する目安・考え方を知りたい", imageCategory: "apply", needsSources: true, sourceIds: ["nta"] },
  // 40. 働き方
  { id: "health", title: "軽貨物ドライバーが長く続けるための体調管理", slugHint: "health-management", category: "働き方・契約", theme: "働き方", mainKeyword: "軽貨物 体調管理", subKeywords: ["ドライバー 健康", "配送 腰痛 対策"], searchIntent: "軽貨物ドライバーを長く続けるための体調・健康管理を知りたい", imageCategory: "driver", needsSources: false, sourceIds: [] },
];

const topicById = new Map(columnTopics.map((t) => [t.id, t]));
export function getTopic(id: string): ColumnTopic | undefined {
  return topicById.get(id);
}
