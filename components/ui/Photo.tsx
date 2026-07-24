import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** アスペクト比のTailwindクラス（例: "aspect-[4/3]"） */
  aspect?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** object-position（人物が切れないよう調整用） */
  position?: string;
  /** 角丸（デフォルトは弱め。全面表示では "rounded-none"） */
  rounded?: string;
};

/**
 * next/imageのラッパー。object-cover・遅延読み込みを標準化し、
 * アスペクト比を固定してレイアウトシフト（CLS）を防ぐ。
 * 角丸は編集的な印象を出すため弱め（既定 rounded-md）。
 */
export function Photo({
  src,
  alt,
  aspect = "aspect-[4/3]",
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  position = "object-center",
  rounded = "rounded-md",
}: Props) {
  return (
    <div className={`relative ${aspect} overflow-hidden ${rounded} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${position}`}
      />
    </div>
  );
}
