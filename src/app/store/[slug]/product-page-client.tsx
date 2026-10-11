"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { WaitlistForm } from "@/components/product/waitlist-form";
import { ProductAccordions } from "./client";

interface SetData {
  name: string;
  description: string | null;
  tagline: string | null;
  coverImage: string;
  productDetails: string | null;
  careInstructions: string | null;
  minPrice: number;
  images: string[];
  campaign: {
    slug: string;
    subtitle: string | null;
    location: string | null;
    date: string | null;
  } | null;
}

export function ProductPageClient({ set }: { set: SetData }) {
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allImages = [set.coverImage, ...set.images].filter(Boolean);

  const introText =
    set.description ||
    "These are simple pleasures of owning and wearing a kimondo, a versatile, well fitted, good looking garment that is extremely comfortable.";

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveImage(idx);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const renderImage = (src: string | undefined, alt: string) => {
    if (src) {
      return <img src={src} alt={alt} className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f0f0]">
        <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">
          Product image
        </span>
      </div>
    );
  };

  return (
    <>
      {/* ── Mobile Layout ── */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Swipeable image carousel */}
        {allImages.length > 1 ? (
          <div>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0 snap-center aspect-[4/5] bg-[#f0f0f0]"
                >
                  {renderImage(img, `${set.name} — ${i + 1}`)}
                </div>
              ))}
            </div>
            {/* Slide indicator */}
            <div className="px-6 pt-6">
              <div className="flex h-[2px]">
                {allImages.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 transition-colors duration-200"
                    style={{ background: i === activeImage ? "#000" : "#e0e0e0" }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full aspect-[4/5] bg-[#f0f0f0]">
              {renderImage(allImages[0], set.name)}
            </div>
            <div className="px-6 pt-6">
              <div className="w-12 h-[2px] bg-black" />
            </div>
          </div>
        )}

        {/* Product info */}
        <div className="px-6 pt-6 pb-4">
          {/* Name + Price + Edition row */}
          <div className="flex items-baseline gap-4 flex-wrap mb-8">
            <h1 className="font-display text-2xl leading-tight">{set.name}</h1>
            <p className="text-base">{formatPrice(set.minPrice)}</p>
            {set.campaign && (
              <p className="text-[10px] text-[#666666] leading-tight ml-auto">
                Shot on film
                <br />
                in {set.campaign.location || "Leh, Ladakh"}
                {set.campaign.date ? ` · ${set.campaign.date}` : ""}
                <br />
                Edition: 001 / 040
              </p>
            )}
          </div>

          <WaitlistForm />

          <Link
            href="/archive"
            className="flex items-center justify-center w-full mt-4 h-12 border border-black text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
          >
            View archive
          </Link>
        </div>

        {/* Mobile footer */}
        <div className="mt-auto px-6 py-8 flex justify-between items-start">
          <div>
            <p className="text-sm font-bold tracking-[0.08em]">
              KIMONDO<sup className="text-[7px] ml-[1px]">&reg;</sup>
            </p>
            <p className="text-[11px] text-[#666666] mt-1">Made in Bharat</p>
          </div>
          <div className="text-right space-y-2">
            <Link href="/faq" className="block text-[11px] text-[#666666] hover:text-black">FAQs</Link>
            <Link href="/policy/returns" className="block text-[11px] text-[#666666] hover:text-black">Return Policy</Link>
            <Link href="/founder" className="block text-[11px] text-[#666666] hover:text-black">Get in touch</Link>
          </div>
        </div>
      </div>

      {/* ── Desktop Layout ── */}
      <div className="hidden lg:flex lg:flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 grid grid-cols-[minmax(260px,1fr)_minmax(400px,2fr)_minmax(260px,1fr)]">
          {/* Left column */}
          <div className="flex flex-col justify-between px-10 py-12">
            <p className="text-[13px] leading-[1.7] text-[#333333] max-w-[320px]">
              {introText}
            </p>

            <div>
              {set.campaign && (
                <div className="mb-10">
                  <p className="text-[11px] text-[#666666] mb-3">
                    {set.campaign.subtitle || `Edition 001 — shot on film in ${set.campaign.location || "Leh, Ladakh"}`}
                  </p>
                  <Link
                    href={`/archive/${set.campaign.slug}`}
                    className="inline-flex items-center justify-center h-11 px-10 border border-black text-[10px] font-medium tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    View campaign
                  </Link>
                </div>
              )}

              <ProductAccordions
                productDetails={set.productDetails}
                careInstructions={set.careInstructions}
              />
            </div>

            <p className="text-[11px] tracking-[0.12em] uppercase text-[#999999]">
              KIMONDO — MADE IN BHARAT
            </p>
          </div>

          {/* Center — Hero image (switches on thumbnail click) */}
          <div className="relative overflow-hidden">
            <div className="sticky top-16 h-[calc(100vh-64px)]">
              {allImages.length > 0 ? (
                <img
                  key={activeImage}
                  src={allImages[activeImage]}
                  alt={`${set.name} — ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#f0f0f0]">
                  <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">
                    Product image
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-between px-10 py-12">
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h1 className="font-display text-[clamp(28px,2.5vw,38px)] leading-[1.1]">
                  {set.name}
                </h1>
                <p className="text-base whitespace-nowrap font-display">
                  {formatPrice(set.minPrice)}
                </p>
              </div>
              {(set.tagline || set.description) && (
                <p className="text-[13px] text-[#444444] leading-relaxed">
                  {set.tagline || set.description}
                </p>
              )}
            </div>

            <div>
              <WaitlistForm />
            </div>

            {/* Clickable thumbnail gallery strip */}
            <div className="flex gap-3">
              {allImages.length > 0
                ? allImages.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-[72px] h-[72px] overflow-hidden bg-[#f0f0f0] flex-shrink-0 transition-opacity ${
                        i === activeImage
                          ? "opacity-100 ring-1 ring-black"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${set.name} — ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))
                : [0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-[72px] h-[72px] bg-[#f0f0f0] flex-shrink-0"
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* Page footer bar */}
        <div className="flex items-center justify-between px-10 py-5 border-t border-[rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-8">
            <Link href="/policy/terms" className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2">Terms</Link>
            <Link href="/policy/privacy" className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2">Privacy</Link>
            <Link href="/policy/shipping" className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2">Shipping &amp; returns</Link>
            <Link href="/faq" className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2">FAQs</Link>
          </div>
          <p className="text-[11px] text-[#666666]">KIMONDO — MADE IN BHARAT</p>
        </div>
      </div>
    </>
  );
}
