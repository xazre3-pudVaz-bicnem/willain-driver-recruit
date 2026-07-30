/**
 * 自動生成コラムのアイキャッチ画像カタログ。
 *
 * public/images/photos 配下の既存写真（AI生成のイメージ画像）だけを使う。
 * Anthropic APIに画像生成はさせない。
 *
 * usedCount / lastUsedAt はスペック要件として保持するが、
 * 「直近5記事で使った画像を避ける」実際の判定は data/column-history.json の
 * 各記事の image を正として計算する（このファイルを毎回書き換えないため）。
 *
 * alt は実写と誤認させないよう、必ず「〜のイメージ」と表記する。
 */

export type ColumnImageCategory =
  | "driver" // ドライバー
  | "van" // 軽バン・車両
  | "cargo" // 荷室・荷物
  | "warehouse" // 配送センター
  | "city" // 東京・千葉の街並み／湾岸
  | "training" // 研修
  | "delivery" // 配送実務
  | "apply"; // 応募・面談

export type ColumnImage = {
  path: string;
  category: ColumnImageCategory;
  alt: string;
  width: number;
  height: number;
  /** スペック要件（実運用の判定は history 側で行う） */
  usedCount: number;
  lastUsedAt: string | null;

  /* --- 実写を追加できるようにするためのメタ（未指定＝AI生成イメージとして扱う） --- */
  /** AI生成画像か（既定 true）。false は実写 */
  isGenerated?: boolean;
  /** 株式会社ウィランの実際の車両・研修・現場などを撮影した実写か（既定 false） */
  isActualCompanyPhoto?: boolean;
  /** 撮影日（実写の場合・YYYY-MM-DD） */
  photographedAt?: string;
  /** 関連エリア（任意） */
  area?: string;
  /** キャプション（実写の場合に表示可能） */
  caption?: string;
  /** クレジット（撮影者・提供元など） */
  credit?: string;
};

/**
 * 実写（株式会社ウィランの実物）かどうか。
 * true のときだけ「株式会社ウィランの配送車両」等の実写表記を許可する。
 * それ以外は必ず「〜のイメージ」と表記する（AI生成画像を実物と偽らない）。
 */
export function isActualPhoto(img: ColumnImage): boolean {
  return img.isActualCompanyPhoto === true && img.isGenerated !== true;
}

/** 横長写真のみ（アイキャッチは 3:2 前後が扱いやすいため縦長は除外） */
export const columnImages: ColumnImage[] = [
  {
    path: "/images/photos/van-city.webp",
    category: "van",
    alt: "東京の街並みと配送用の白い軽バンのイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/work-driving.webp",
    category: "driver",
    alt: "軽貨物ドライバーが軽バンを運転するイメージ",
    width: 1200,
    height: 800,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/cta-drive.webp",
    category: "driver",
    alt: "配送に向かう軽貨物ドライバーのイメージ",
    width: 1536,
    height: 1024,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/work-loading.webp",
    category: "cargo",
    alt: "軽貨物ドライバーが荷物を積み込むイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/van-interior.webp",
    category: "cargo",
    alt: "配送用軽バンの荷室のイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/warehouse.webp",
    category: "warehouse",
    alt: "荷物を積み込む配送センターのイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/fleet.webp",
    category: "van",
    alt: "並んだ配送用軽バンのイメージ",
    width: 1400,
    height: 1050,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/training.webp",
    category: "training",
    alt: "軽貨物ドライバーの横乗り研修のイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/app-scan.webp",
    category: "delivery",
    alt: "配送アプリで荷物を確認するイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/walking.webp",
    category: "delivery",
    alt: "荷物を持って個人宅へ向かう配送のイメージ",
    width: 1200,
    height: 800,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/area-shinagawa.webp",
    category: "city",
    alt: "品川エリアの街並みと配送のイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/area-koto.webp",
    category: "city",
    alt: "江東エリアの街並みと配送のイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/area-kasai.webp",
    category: "city",
    alt: "葛西・江戸川エリアの街並みと配送のイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
  {
    path: "/images/photos/area-funabashi.webp",
    category: "city",
    alt: "船橋エリアの街並みと配送のイメージ",
    width: 1200,
    height: 900,
    usedCount: 0,
    lastUsedAt: null,
  },
];

const imageByPath = new Map(columnImages.map((img) => [img.path, img]));

export function getColumnImage(path: string): ColumnImage | undefined {
  return imageByPath.get(path);
}

/**
 * 直近使用を避けて画像を1枚選ぶ。
 * @param recentlyUsedPaths 直近に使った画像パス（新しい順・先頭5件を回避対象にする）
 * @param preferred 優先カテゴリ（該当がなければ全体から選ぶ）
 */
export function pickColumnImage(
  recentlyUsedPaths: string[],
  preferred?: ColumnImageCategory,
): ColumnImage {
  const avoid = new Set(recentlyUsedPaths.slice(0, 5));

  const notRecent = columnImages.filter((img) => !avoid.has(img.path));
  const pool = notRecent.length > 0 ? notRecent : columnImages;

  // カテゴリ優先（直近回避を満たす範囲で）
  if (preferred) {
    const preferredPool = pool.filter((img) => img.category === preferred);
    if (preferredPool.length > 0) {
      return leastRecentlyUsed(preferredPool, recentlyUsedPaths);
    }
  }
  return leastRecentlyUsed(pool, recentlyUsedPaths);
}

/** recentlyUsedPaths でより過去（または未使用）のものを優先し、決定的に選ぶ */
function leastRecentlyUsed(
  pool: ColumnImage[],
  recentlyUsedPaths: string[],
): ColumnImage {
  const rank = (path: string) => {
    const idx = recentlyUsedPaths.indexOf(path);
    return idx === -1 ? Number.MAX_SAFE_INTEGER : recentlyUsedPaths.length - idx;
  };
  return [...pool].sort((a, b) => {
    const ra = rank(a.path);
    const rb = rank(b.path);
    if (ra !== rb) return rb - ra; // 未使用・より過去を優先
    return a.path < b.path ? -1 : 1; // 決定的タイブレーク
  })[0];
}
