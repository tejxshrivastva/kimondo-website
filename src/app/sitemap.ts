import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { POLICY_SLUGS } from "@/lib/constants";

const BASE = "https://www.kimondo.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sets, campaigns] = await Promise.all([
    prisma.set.findMany({
      where: { status: "live" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.campaign.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/store`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/archive`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/founder`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.5 },
    ...POLICY_SLUGS.map((slug) => ({
      url: `${BASE}/policy/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];

  const setPages: MetadataRoute.Sitemap = sets.map((s) => ({
    url: `${BASE}/store/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const campaignPages: MetadataRoute.Sitemap = campaigns.map((c) => ({
    url: `${BASE}/archive/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...setPages, ...campaignPages];
}
