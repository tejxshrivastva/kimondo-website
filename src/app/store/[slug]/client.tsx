"use client";

import { useState } from "react";
import { useOverlayStore } from "@/store/overlay-store";

interface ProductAccordionsProps {
  productDetails?: string | null;
  careInstructions?: string | null;
}

export function ProductAccordions({
  productDetails,
  careInstructions,
}: ProductAccordionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { openSizeGuide } = useOverlayStore();

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const sections: { label: string; content: string | null; isSizing?: boolean }[] = [
    { label: "Details", content: productDetails || null },
    { label: "Sizing", content: "sizing", isSizing: true },
    { label: "Material", content: "Details coming soon." },
    { label: "Care", content: careInstructions || null },
  ].filter((s) => s.content);

  return (
    <div>
      {sections.map((section, i) => (
        <div key={section.label}>
          <button
            onClick={() => toggle(i)}
            className="flex items-center gap-3 py-2.5 text-sm font-medium w-full text-left group min-h-[44px] lg:min-h-0"
          >
            <span className="text-xs text-[#888888] w-5 text-center shrink-0 transition-colors group-hover:text-black">
              ({openIndex === i ? "−" : "+"})
            </span>
            <span className="transition-colors group-hover:text-black">{section.label}</span>
          </button>
          {openIndex === i && (
            <div className="pl-8 pb-2 max-h-[80px] overflow-y-auto">
              {section.isSizing ? (
                <button
                  onClick={openSizeGuide}
                  className="text-xs text-[#666666] underline underline-offset-4 hover:text-black transition-colors"
                >
                  View size guide
                </button>
              ) : (
                <p className="text-xs text-[#666666] leading-relaxed max-w-[280px] md:max-w-[360px]">
                  {section.content}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
