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
  coverImage,
  minPrice,
}: SetCardProps) {
  return (
    <Link href={`/store/${slug}`} className="group block">
      <div className="aspect-[4/5] mb-3 overflow-hidden bg-[#f0f0f0] rounded-xl">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">
              Image
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium">{name}</h3>
      <div className="relative h-5 mt-0.5 overflow-hidden">
        {minPrice != null ? (
          <>
            <p className="text-xs text-[#999] transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-1">
              Shop now
            </p>
            <p className="absolute top-0 text-xs text-[#999] opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              From {formatPrice(minPrice)}
            </p>
          </>
        ) : (
          <p className="text-xs text-[#999]">Shop now</p>
        )}
      </div>
    </Link>
  );
}
