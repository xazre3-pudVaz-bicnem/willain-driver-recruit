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
};

/**
 * next/imageのラッパー。角丸・object-cover・遅延読み込みを標準化し、
 * アスペクト比を固定してレイアウトシフト（CLS）を防ぐ。
 */
export function Photo({
  src,
  alt,
  aspect = "aspect-[4/3]",
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  position = "object-center",
}: Props) {
  return (
    <div
      className={`relative ${aspect} overflow-hidden rounded-2xl shadow-card ${className}`}
    >
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
