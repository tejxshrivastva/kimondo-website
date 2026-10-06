import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface SetCardProps {
  slug: string;
  name: string;
  tagline?: string | null;
  coverImage?: string;
  toneFrom: string;
  toneTo: string;
  minPrice?: number;
  itemCount?: number;
  showPrice?: boolean;
}

export function SetCard({
  slug,
  name,
  tagline,
  coverImage,
  toneFrom,
  toneTo,
  minPrice,
  itemCount,
  showPrice = true,
}: SetCardProps) {
  return (
    <Link href={`/store/${slug}`} className="group block">
      <div
        className="aspect-[4/5] mb-3 overflow-hidden"
        style={!coverImage ? { background: `linear-gradient(150deg, ${toneFrom}, ${toneTo})` } : undefined}
      >
        {coverImage && (
          <img src={coverImage} alt={name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-lg">{name}</h3>
        {tagline && (
          <p className="text-sm text-muted">{tagline}</p>
        )}
        {showPrice && minPrice != null && itemCount != null && (
          <p className="text-sm">
            From {formatPrice(minPrice)} · {itemCount}{" "}
            {itemCount === 1 ? "piece" : "pieces"}
          </p>
        )}
      </div>
    </Link>
  );
}
