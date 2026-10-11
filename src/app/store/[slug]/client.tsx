"use client";

import { useState } from "react";

interface ProductAccordionsProps {
  productDetails?: string | null;
  careInstructions?: string | null;
}

export function ProductAccordions({
  productDetails,
  careInstructions,
}: ProductAccordionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sections = [
    { label: "Details", content: productDetails || null },
    { label: "Sizing", content: "View size guide for measurements." },
    { label: "Material", content: "Details coming soon." },
    { label: "Care", content: careInstructions || null },
  ].filter((s) => s.content);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-1">
      {sections.map((section, i) => (
        <div key={section.label}>
          <button
            onClick={() => toggle(i)}
            className="flex items-center gap-3 py-2 text-sm font-medium w-full text-left"
          >
            <span className="text-xs text-[#666666] w-5 text-center shrink-0">
              ({openIndex === i ? "−" : "+"})
            </span>
            {section.label}
          </button>
          {openIndex === i && section.content && (
            <p className="pl-8 pb-3 text-xs text-[#666666] leading-relaxed max-w-[280px]">
              {section.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
