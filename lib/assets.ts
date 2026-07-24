import fs from "fs";
import path from "path";

/**
 * publicフォルダ内にファイルが存在するかをビルド時に判定する。
 * 例: hasPublicFile("images/hero-driver.webp")
 * 画像を追加すれば次回ビルドから自動的に差し替わる。
 */
export function hasPublicFile(relativePath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", relativePath));
  } catch {
    return false;
  }
}
