"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useOverlayStore } from "@/store/overlay-store";
import { formatPrice } from "@/lib/utils";

interface SetDetailClientProps {
  action: "setButton" | "itemButton" | "itemRow" | "accordions";
  setSlug?: string;
  itemId?: string;
  itemName?: string;
  itemCategory?: string;
  itemPrice?: number;
  productDetails?: string | null;
  careInstructions?: string | null;
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
}: SetDetailClientProps) {
  const { openSetPicker, openItemPicker, openSizeGuide } = useOverlayStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [careOpen, setCareOpen] = useState(false);

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
