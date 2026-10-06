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
  showPrice = true,
}: SetCardProps) {
  return (
    <Link href={`/store/${slug}`} className="group block">
      <div className="relative aspect-[4/5] mb-3 overflow-hidden bg-[#f0f0f0] rounded-xl transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center transition-colors duration-300 group-hover:bg-[#e8e8e8]">
            <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">
              Image
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.04]" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase text-white bg-black/80 backdrop-blur-sm px-3 py-1.5">
            View product
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
      <div className="overflow-hidden">
        <h3 className="text-sm font-medium transition-colors duration-200 group-hover:text-black">{name}</h3>
        <div className="relative h-5 mt-0.5">
          {minPrice != null ? (
            <>
              <p className="text-sm text-[#999] transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                Shop now
              </p>
              <p className="absolute top-0 text-sm font-medium text-black opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                From {formatPrice(minPrice)}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#999] transition-all duration-200 group-hover:text-black">
              Shop now
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
