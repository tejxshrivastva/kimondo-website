"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  section: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const sections = faqs.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    const key = faq.section || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(faq);
    return acc;
  }, {});

  const sectionKeys = Object.keys(sections);
  const hasSections = sectionKeys.length > 1 || (sectionKeys.length === 1 && sectionKeys[0] !== "General");

  return (
    <div className="space-y-10">
      {sectionKeys.map((section) => (
        <div key={section}>
          {hasSections && (
            <h2 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-4">
              {section}
            </h2>
          )}
          <div className="divide-y divide-[rgba(0,0,0,0.1)] border-t border-[rgba(0,0,0,0.1)]">
            {sections[section].map((faq) => (
              <div key={faq.id}>
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-start justify-between py-5 text-left gap-4"
                >
                  <span className="font-medium text-base">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 mt-1 transition-transform ${
                      openId === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openId === faq.id && (
                  <p className="pb-5 text-[#666666] leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
