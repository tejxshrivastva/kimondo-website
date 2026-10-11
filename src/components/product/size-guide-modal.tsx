"use client";

import { X } from "lucide-react";
import { useOverlayStore } from "@/store/overlay-store";

const sizes = [
  { label: "XS", chest: "32", waist: "26", hip: "34" },
  { label: "S", chest: "34", waist: "28", hip: "36" },
  { label: "M", chest: "36", waist: "30", hip: "38" },
  { label: "L", chest: "38", waist: "32", hip: "40" },
  { label: "XL", chest: "40", waist: "34", hip: "42" },
  { label: "XXL", chest: "42", waist: "36", hip: "44" },
];

export function SizeGuideModal() {
  const { sizeGuideOpen, closeSizeGuide } = useOverlayStore();

  if (!sizeGuideOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-[80]"
        onClick={closeSizeGuide}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[480px] bg-white z-[80] p-6 animate-fade-in">
        <button
          onClick={closeSizeGuide}
          className="absolute top-4 right-4 p-1"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg mb-4">Size guide</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-semibold">Size</th>
                <th className="text-left py-2 pr-4 font-semibold">
                  Chest (in)
                </th>
                <th className="text-left py-2 pr-4 font-semibold">
                  Waist (in)
                </th>
                <th className="text-left py-2 font-semibold">Hip (in)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s) => (
                <tr key={s.label} className="border-b border-black/5">
                  <td className="py-2 pr-4 font-medium">{s.label}</td>
                  <td className="py-2 pr-4 text-muted">{s.chest}</td>
                  <td className="py-2 pr-4 text-muted">{s.waist}</td>
                  <td className="py-2 text-muted">{s.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted mt-4">
          Measurements are in inches. For the best fit, measure a garment you already wear.
        </p>
      </div>
    </>
  );
}
