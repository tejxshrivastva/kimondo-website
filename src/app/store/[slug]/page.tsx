import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { WaitlistForm } from "@/components/product/waitlist-form";
import { ProductAccordions } from "./client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const set = await prisma.set.findUnique({ where: { slug } });
  if (!set) return { title: "Not Found" };
  return {
    title: set.name,
    description: set.description?.slice(0, 160) || `The ${set.name} set.`,
  };
}

export default async function SetPage({ params }: Props) {
  const { slug } = await params;
  const set = await prisma.set.findUnique({
    where: { slug, status: "live" },
    include: {
      items: {
        include: { variants: true },
        orderBy: { sortOrder: "asc" },
      },
      campaign: true,
    },
  });

  if (!set) notFound();

  const prices = set.items.map((i) => i.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const setImages: string[] = JSON.parse(set.images || "[]");

  const introText =
    set.description ||
    "These are simple pleasures of owning and wearing a kimondo, a versatile, well fitted, good looking garment that is extremely comfortable.";

  return (
    <>
      {/* ── Mobile Layout ── */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Hero image */}
        <div className="w-full aspect-[4/5] bg-[#f0f0f0] overflow-hidden">
          {set.coverImage ? (
            <img
              src={set.coverImage}
              alt={set.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">
                Product image
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="px-6 pt-8 pb-4">
          {/* Divider */}
          <div className="w-12 h-[2px] bg-black mb-8" />

          {/* Name + Price + Edition row */}
          <div className="flex items-baseline gap-4 flex-wrap mb-8">
            <h1 className="font-display text-2xl leading-tight">{set.name}</h1>
            <p className="text-base">{formatPrice(minPrice)}</p>
            {set.campaign && (
              <p className="text-[10px] text-[#666666] leading-tight ml-auto">
                Shot on film
                <br />
                in {set.campaign.location || "Leh, Ladakh"}
                <br />
                Edition: 001 / 040
              </p>
            )}
          </div>

          {/* Waitlist form */}
          <WaitlistForm />

          {/* View Archive */}
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
            <Link
              href="/faq"
              className="block text-[11px] text-[#666666] hover:text-black"
            >
              FAQs
            </Link>
            <Link
              href="/policy/returns"
              className="block text-[11px] text-[#666666] hover:text-black"
            >
              Return Policy
            </Link>
            <Link
              href="/founder"
              className="block text-[11px] text-[#666666] hover:text-black"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* ── Desktop Layout ── */}
      <div className="hidden lg:flex lg:flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 grid grid-cols-[minmax(260px,1fr)_minmax(400px,2fr)_minmax(260px,1fr)]">
          {/* Left column */}
          <div className="flex flex-col justify-between px-10 py-12">
            {/* Intro text */}
            <p className="text-[13px] leading-[1.7] text-[#333333] max-w-[320px]">
              {introText}
            </p>

            {/* Campaign + Accordions */}
            <div>
              {set.campaign && (
                <div className="mb-10">
                  <p className="text-[11px] text-[#666666] mb-3">
                    Edition 001 — shot on film in{" "}
                    {set.campaign.location || "Leh, Ladakh"}
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

            {/* Branding */}
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#999999]">
              KIMONDO — MADE IN BHARAT
            </p>
          </div>

          {/* Center — Hero image */}
          <div className="relative overflow-hidden">
            <div className="sticky top-16 h-[calc(100vh-64px)]">
              {set.coverImage ? (
                <img
                  src={set.coverImage}
                  alt={set.name}
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
            {/* Product name + price + description */}
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h1 className="font-display text-[clamp(28px,2.5vw,38px)] leading-[1.1]">
                  {set.name}
                </h1>
                <p className="text-base whitespace-nowrap font-display">
                  {formatPrice(minPrice)}
                </p>
              </div>
              {set.tagline && (
                <p className="text-[13px] text-[#444444] leading-relaxed">
                  {set.tagline}
                </p>
              )}
            </div>

            {/* Waitlist form */}
            <div>
              <WaitlistForm />
            </div>

            {/* Thumbnail gallery strip */}
            <div className="flex gap-3">
              {setImages.length > 0
                ? setImages.slice(0, 4).map((img, i) => (
                    <div
                      key={i}
                      className="w-[72px] h-[72px] overflow-hidden bg-[#f0f0f0] flex-shrink-0"
                    >
                      <img
                        src={img}
                        alt={`${set.name} — ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
            <Link
              href="/policy/terms"
              className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2"
            >
              Terms
            </Link>
            <Link
              href="/policy/privacy"
              className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2"
            >
              Privacy
            </Link>
            <Link
              href="/policy/shipping"
              className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2"
            >
              Shipping &amp; returns
            </Link>
            <Link
              href="/faq"
              className="text-[11px] text-[#666666] hover:text-black underline underline-offset-2"
            >
              FAQs
            </Link>
          </div>
          <p className="text-[11px] text-[#666666]">KIMONDO — MADE IN BHARAT</p>
        </div>
      </div>
    </>
  );
}
