import clsx from "clsx";

type FlavorArtProps = {
  colorHex: string;
  compact?: boolean;
  className?: string;
};

function hexToRgba(colorHex: string, alpha: number) {
  const hex = colorHex.replace("#", "");

  if (hex.length !== 6) {
    return `rgba(255, 153, 102, ${alpha})`;
  }

  const value = Number.parseInt(hex, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function FlavorArt({
  colorHex,
  compact = false,
  className,
}: FlavorArtProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "relative overflow-hidden rounded-[28px] border border-white/60",
        compact ? "h-44" : "h-72",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 20% 10%, ${hexToRgba(colorHex, 0.34)}, transparent 35%), linear-gradient(160deg, rgba(255,255,255,0.96), rgba(255,247,237,0.88))`,
      }}
    >
      <div
        className="absolute -top-10 right-2 h-24 w-24 rounded-full blur-2xl"
        style={{ backgroundColor: hexToRgba(colorHex, 0.25) }}
      />
      <div
        className="absolute left-1/2 top-[16%] h-28 w-28 -translate-x-1/2 rounded-full border border-white/80 shadow-[0_18px_35px_-24px_rgba(32,20,13,0.45)]"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.96), ${hexToRgba(colorHex, 0.94)})`,
        }}
      />
      <div
        className="absolute left-[24%] top-[38%] h-24 w-24 rounded-full border border-white/70 shadow-[0_18px_35px_-24px_rgba(32,20,13,0.45)]"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.95), ${hexToRgba(colorHex, 0.86)})`,
        }}
      />
      <div
        className="absolute right-[24%] top-[38%] h-24 w-24 rounded-full border border-white/70 shadow-[0_18px_35px_-24px_rgba(32,20,13,0.45)]"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.95), ${hexToRgba(colorHex, 0.8)})`,
        }}
      />
      <div
        className="absolute bottom-[12%] left-1/2 h-28 w-24 -translate-x-1/2 rounded-b-[30px]"
        style={{
          clipPath: "polygon(50% 100%, 0 0, 100% 0)",
          background:
            "linear-gradient(180deg, rgba(246,203,154,0.98), rgba(224,162,104,0.98))",
          boxShadow: "0 18px 35px -24px rgba(88, 51, 22, 0.5)",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_32%,rgba(255,255,255,0.25)_32%,rgba(255,255,255,0.25)_36%,transparent_36%,transparent_64%,rgba(255,255,255,0.25)_64%,rgba(255,255,255,0.25)_68%,transparent_68%)]" />
      </div>
      <div
        className="absolute left-[18%] top-[18%] h-3 w-3 rounded-full bg-white/70"
        style={{ boxShadow: `0 0 0 8px ${hexToRgba(colorHex, 0.16)}` }}
      />
      <div className="absolute bottom-[20%] right-[18%] h-4 w-4 rounded-full bg-white/60" />
    </div>
  );
}
