import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = "https://taiwan-access-map.vercel.app";

// Generate at request time, not build time: this needs a real DB connection
// (unavailable in CI's build-only environment) and should reflect newly
// added places without waiting for the next deploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await prisma.place.findMany({
    where: { status: "APPROVED" },
    select: { id: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/places/new`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/register`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const placeRoutes: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${SITE_URL}/places/${place.id}`,
    lastModified: place.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...placeRoutes];
}
