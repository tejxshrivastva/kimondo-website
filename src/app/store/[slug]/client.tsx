"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useOverlayStore } from "@/store/overlay-store";
import { formatPrice } from "@/lib/utils";

interface SliderImage {
  id: string;
  name: string;
  image: string | null;
}

interface SetDetailClientProps {
  action: "setButton" | "itemButton" | "itemRow" | "accordions" | "imageSlider";
  setSlug?: string;
  itemId?: string;
  itemName?: string;
  itemCategory?: string;
  itemPrice?: number;
  productDetails?: string | null;
  careInstructions?: string | null;
  sliderImages?: SliderImage[];
  toneFrom?: string;
  toneTo?: string;
}

export function SetDetailClient({
  action,
  setSlug,
  itemId,
  itemName,
  itemCategory,
  itemPrice,
  productDetails,
  careInstructions,
  sliderImages,
  toneFrom,
  toneTo,
}: SetDetailClientProps) {
  const { openSetPicker, openItemPicker, openSizeGuide } = useOverlayStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (action === "setButton") {
    return (
      <button
        onClick={() => openSetPicker(setSlug!)}
        className="w-full h-12 bg-black text-white text-sm font-semibold hover:bg-black/90 transition-colors"
      >
        Shop the set
      </button>
    );
  }

  if (action === "itemButton") {
    return (
      <button
        onClick={() => openItemPicker(setSlug!, itemId!)}
        className="h-10 px-5 bg-white text-black text-sm font-semibold border border-[rgba(0,0,0,0.16)] hover:bg-black hover:text-white transition-colors"
      >
        Shop {itemName}
      </button>
    );
  }

  if (action === "itemRow") {
    return (
      <button
        onClick={() => openItemPicker(setSlug!, itemId!)}
        className="w-full flex items-center justify-between p-3 border border-[rgba(0,0,0,0.16)] hover:border-black transition-colors text-left"
      >
        <div>
          <span className="text-sm font-medium">{itemName}</span>
          <span className="text-sm text-muted ml-2 capitalize">
            {itemCategory}
          </span>
        </div>
        <span className="text-sm">{formatPrice(itemPrice!)}</span>
      </button>
    );
  }

  if (action === "imageSlider") {
    const images = sliderImages || [];
    const total = images.length;

    const prev = () => setCurrentSlide((s) => (s - 1 + total) % total);
    const next = () => setCurrentSlide((s) => (s + 1) % total);

    return (
      <div className="relative aspect-[4/5] overflow-hidden sticky top-24">
        {total > 0 ? (
          <>
            {images.map((img, i) => (
              <div
                key={img.id}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === currentSlide ? 1 : 0 }}
              >
                {img.image ? (
                  <img
                    src={img.image}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(150deg, ${toneFrom || "#d4d4d4"}, ${toneTo || "#a3a3a3"})`,
                    }}
                  />
                )}
              </div>
            ))}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2 h-2 transition-colors ${i === currentSlide ? "bg-black" : "bg-black/30"}`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(150deg, ${toneFrom || "#d4d4d4"}, ${toneTo || "#a3a3a3"})`,
            }}
          />
        )}
      </div>
    );
  }

  if (action === "accordions") {
    return (
      <div className="border-t border-[rgba(0,0,0,0.1)] divide-y divide-[rgba(0,0,0,0.1)]">
        {productDetails && (
          <div>
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full flex items-center justify-between py-4 text-sm font-medium"
            >
              Product details
              <ChevronDown
                size={16}
                className={`transition-transform ${detailsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {detailsOpen && (
              <p className="pb-4 text-sm text-[#666666] leading-relaxed">
                {productDetails}
              </p>
            )}
          </div>
        )}
        {careInstructions && (
          <div>
            <button
              onClick={() => setCareOpen(!careOpen)}
              className="w-full flex items-center justify-between py-4 text-sm font-medium"
            >
              Care instructions
              <ChevronDown
                size={16}
                className={`transition-transform ${careOpen ? "rotate-180" : ""}`}
              />
            </button>
            {careOpen && (
              <p className="pb-4 text-sm text-[#666666] leading-relaxed">
                {careInstructions}
              </p>
            )}
          </div>
        )}
        <div>
          <button
            onClick={openSizeGuide}
            className="w-full flex items-center justify-between py-4 text-sm font-medium"
          >
            Size guide
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
