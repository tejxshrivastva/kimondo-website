export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SetCard } from "@/components/product/set-card";

export default async function HomePage() {
  const homepage = await prisma.homepageSetting.findFirst();
  const sets = await prisma.set.findMany({
    where: { status: "live" },
    include: { items: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      {/* Hero - full viewport, video/image background */}
      <section className="relative min-h-[100dvh] -mt-16 pt-16 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background: video if uploaded, image if uploaded, gray fallback */}
        {homepage?.heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={homepage.heroVideo} type="video/mp4" />
          </video>
        ) : homepage?.heroImage ? (
          <img
            src={homepage.heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#f8f8f8]" />
        )}

        {(homepage?.heroVideo || homepage?.heroImage) && (
          <div className="absolute inset-0 bg-black/30" />
        )}

        <div className="relative z-10">
          <p className="text-[9px] font-semibold tracking-[0.3em] uppercase mb-6" style={{ color: homepage?.heroVideo || homepage?.heroImage ? "rgba(255,255,255,0.7)" : "#757575" }}>
            Kimondo
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-[0.3px] whitespace-nowrap"
            style={{ color: homepage?.heroVideo || homepage?.heroImage ? "#fff" : "#000" }}
          >
            Headline goes here
          </h1>
          <p
            className="mt-4 text-lg"
            style={{ color: homepage?.heroVideo || homepage?.heroImage ? "rgba(255,255,255,0.8)" : "#666666" }}
          >
            Subtext placeholder for the hero section
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={homepage?.ctaTarget || "/store"}
              className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-semibold tracking-[0.2px] hover:bg-black/90 transition-colors"
            >
              {homepage?.ctaLabel || "Shop now"}
            </Link>
            <Link
              href="/archive"
              className="inline-flex items-center justify-center h-12 px-8 border text-sm font-semibold transition-colors"
              style={{ color: homepage?.heroVideo || homepage?.heroImage ? "#fff" : "#000", borderColor: homepage?.heroVideo || homepage?.heroImage ? "rgba(255,255,255,0.5)" : "#000" }}
            >
              The archive
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sets */}
      {sets.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[9px] font-semibold tracking-[0.3em] uppercase text-muted">
              The collection
            </h2>
            <Link
              href="/store"
              className="text-sm font-medium underline underline-offset-4"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-x-4 lg:gap-y-8">
            {sets.map((set) => (
                <SetCard
                  key={set.id}
                  slug={set.slug}
                  name={set.name}
                  coverImage={set.coverImage || undefined}
                  showPrice={false}
                />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
