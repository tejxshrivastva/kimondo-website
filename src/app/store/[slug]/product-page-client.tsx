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
      {/* ── Mobile + Tablet Layout (below lg:1024px) ── */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* On tablet (md+), side-by-side grid; on mobile, stacked */}
        <div className="md:grid md:grid-cols-2 md:min-h-[calc(100vh-64px)]">
          {/* Image section */}
          <div className="md:sticky md:top-16 md:h-[calc(100vh-64px)] md:overflow-hidden">
            {/* Mobile: swipeable carousel / Tablet: single image with thumbnails below */}
            {allImages.length > 1 ? (
              <div className="h-full flex flex-col">
                {/* Mobile carousel */}
                <div className="md:hidden">
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
                  <div className="px-6 pt-3">
                    <div className="flex gap-[3px] h-[2px]">
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
                {/* Tablet: main image + thumbnails */}
                <div className="hidden md:flex md:flex-col md:h-full">
                  <div className="flex-1 bg-[#f0f0f0]">
                    {renderImage(allImages[activeImage], `${set.name} — ${activeImage + 1}`)}
                  </div>
                  <div className="flex gap-2 p-4">
                    {allImages.slice(0, 4).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 overflow-hidden bg-[#f0f0f0] flex-shrink-0 transition-opacity ${
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
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="w-full aspect-[4/5] md:aspect-auto md:flex-1 bg-[#f0f0f0]">
                  {renderImage(allImages[0], set.name)}
                </div>
                <div className="px-6 pt-3 md:hidden">
                  <div className="w-12 h-[2px] bg-black" />
                </div>
              </div>
            )}
          </div>

          {/* Product info — scrollable on tablet */}
          <div className="flex flex-col md:overflow-y-auto">
            <div className="px-6 pt-6 pb-4 md:px-8 md:py-10">
              {/* Name + Price + Edition */}
              <div className="flex items-baseline gap-4 flex-wrap mb-8">
                <h1 className="text-2xl md:text-3xl font-light leading-tight">{set.name}</h1>
                <p className="text-base md:text-lg">{formatPrice(set.minPrice)}</p>
                {set.campaign && (
                  <p className="text-[10px] md:text-[11px] text-[#666666] leading-tight ml-auto">
                    Shot on film
                    <br />
                    in {set.campaign.location || "Leh, Ladakh"}
                    {set.campaign.date ? ` · ${set.campaign.date}` : ""}
                    <br />
                    Edition: 001 / 040
                  </p>
                )}
              </div>

              {/* Tablet: show description above form */}
              {(set.description || set.tagline) && (
                <p className="hidden md:block text-[13px] text-[#444444] leading-relaxed mb-8 max-w-[400px]">
                  {set.tagline || set.description}
                </p>
              )}

              <WaitlistForm />

              <Link
                href="/archive"
                className="flex items-center justify-center w-full mt-4 h-12 border border-black text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
              >
                View archive
              </Link>

              {/* Tablet: show accordions in the info column */}
              <div className="hidden md:block mt-10">
                <ProductAccordions
                  productDetails={set.productDetails}
                  careInstructions={set.careInstructions}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet footer */}
        <div className="mt-auto px-6 md:px-8 py-8 flex justify-between items-start">
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
      <div className="hidden lg:block h-[calc(100vh-64px)] overflow-hidden relative">
        <div className="h-full grid grid-cols-[minmax(200px,1fr)_minmax(340px,2fr)_minmax(200px,1fr)] xl:grid-cols-[minmax(260px,1fr)_minmax(400px,2fr)_minmax(260px,1fr)] grid-rows-[1fr_auto]">
          {/* Left column */}
          <div className="flex flex-col justify-between px-6 xl:px-10 py-6 min-h-0 overflow-hidden row-span-1">
            <p className="text-[13px] leading-[1.7] text-[#333333] max-w-[320px]">
              {introText}
            </p>

            <div className="min-h-0">
              {set.campaign && (
                <div className="mb-6">
                  <p className="text-[11px] text-[#666666] mb-3">
                    {set.campaign.subtitle || `Edition 001 — shot on film in ${set.campaign.location || "Leh, Ladakh"}`}
                  </p>
                  <Link
                    href={`/archive/${set.campaign.slug}`}
                    className="flex items-center justify-center w-full h-11 border border-black text-[10px] font-medium tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    View campaign
                  </Link>
                </div>
              )}

              <ProductAccordions
                productDetails={set.productDetails}
                careInstructions={set.careInstructions}
              />

              <p className="text-[11px] text-[#666666] tracking-[0.12em] mt-6">
                KIMONDO — MADE IN BHARAT
              </p>
            </div>
          </div>

          {/* Center — Hero image, same row as left/right columns */}
          <div className="relative overflow-hidden">
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

          {/* Right column */}
          <div className="flex flex-col justify-between px-6 xl:px-10 py-6 min-h-0 overflow-hidden">
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h1 className="text-[clamp(24px,2.2vw,38px)] font-light leading-[1.1]">
                  {set.name}
                </h1>
                <p className="text-base whitespace-nowrap">
                  {formatPrice(set.minPrice)}
                </p>
              </div>
              {(set.tagline || set.description) && (
                <p className="text-[13px] text-[#444444] leading-[1.75] max-w-[320px]">
                  {set.tagline || set.description}
                </p>
              )}
            </div>

            <div>
              <WaitlistForm />
            </div>

            {/* Clickable thumbnail gallery strip */}
            <div className="grid grid-cols-4 gap-2 flex-shrink-0">
              {allImages.length > 0
                ? allImages.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square overflow-hidden bg-[#f0f0f0] transition-opacity ${
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
                      className="aspect-square bg-[#f0f0f0]"
                    />
                  ))}
            </div>
          </div>

          {/* Footer bar — spans all 3 columns */}
          <div className="col-span-3 flex items-center justify-between px-6 xl:px-10 py-3 border-t border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-8">
              <Link href="/policy/terms" className="text-[11px] text-[#666666] hover:text-black transition-colors">Terms</Link>
              <Link href="/policy/privacy" className="text-[11px] text-[#666666] hover:text-black transition-colors">Privacy</Link>
              <Link href="/policy/shipping" className="text-[11px] text-[#666666] hover:text-black transition-colors">Shipping &amp; returns</Link>
              <Link href="/faq" className="text-[11px] text-[#666666] hover:text-black transition-colors">FAQs</Link>
            </div>
            <p className="text-[11px] text-[#666666] tracking-[0.12em]">KIMONDO — MADE IN BHARAT</p>
          </div>
        </div>
      </div>
    </>
  );
}
