import Image from "next/image";
import { FlavorArt } from "@/components/flavor-art";
import clsx from "clsx";

type Props = {
  imageUrl?: string | null;
  colorHex: string;
  name: string;
  compact?: boolean;
  className?: string;
};

export function ProductImage({ imageUrl, colorHex, name, compact, className }: Props) {
  if (imageUrl) {
    return (
      <div
        className={clsx(
          "relative overflow-hidden rounded-[28px] border border-white/60",
          compact ? "h-44" : "h-72",
          className,
        )}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-3"
          sizes="(max-width: 640px) 100vw, 400px"
        />
      </div>
    );
  }
  return <FlavorArt colorHex={colorHex} compact={compact} className={className} />;
}
