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

  return (
    <div className="divide-y divide-[rgba(0,0,0,0.1)] border-t border-[rgba(0,0,0,0.1)]">
      {faqs.map((faq) => (
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
  );
}
