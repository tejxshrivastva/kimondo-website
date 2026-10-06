import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface SetCardProps {
  slug: string;
  name: string;
  tagline?: string | null;
  coverImage?: string;
  toneFrom?: string;
  toneTo?: string;
  minPrice?: number;
  itemCount?: number;
  showPrice?: boolean;
}

export function SetCard({
  slug,
  name,
  tagline,
  coverImage,
  minPrice,
  itemCount,
  showPrice = true,
}: SetCardProps) {
  return (
    <Link href={`/store/${slug}`} className="group block">
      <div className="aspect-[4/5] mb-3 overflow-hidden bg-[#f0f0f0] rounded-lg">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">
              Image
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium">{name}</h3>
        {showPrice && minPrice != null && (
          <p className="text-sm text-[#666666] mt-0.5">
            {formatPrice(minPrice)}
          </p>
        )}
      </div>
    </Link>
  );
}
