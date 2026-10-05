import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface SetCardProps {
  slug: string;
  name: string;
  tagline?: string | null;
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
  toneFrom,
  toneTo,
  minPrice,
  itemCount,
  showPrice = true,
}: SetCardProps) {
  return (
    <Link href={`/store/${slug}`} className="group block">
      <div
        className="aspect-[4/5] rounded-[12px] mb-3 overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${toneFrom}, ${toneTo})`,
        }}
      />
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
