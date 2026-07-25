このフォルダの画像について

【現在の構成】
- hero-driver.webp        トップのヒーロー画像（差し替え可）
- logo.png                ヘッダー・フッターのロゴ（透過PNG）
- photos/*.webp           各ページのセクション写真（最適化済みWebP）

いずれも design-source/photos/ にある元画像（ChatGPT生成PNG・logo.jpg）を
sharp で最適化して生成したものです。元画像は design-source/ に退避しており、
デプロイ対象外（.gitignore済み）です。

【差し替え方法】
- ヒーロー写真: hero-driver.webp を同名で上書き（16:9推奨）
- ロゴ: logo.png を同名で上書き（透過PNG推奨）。読み込み失敗時は会社名テキストにフォールバック
- 各セクション写真: photos/ 配下の同名ファイルを上書き

※差し替え後は npm run build を再実行してください。
