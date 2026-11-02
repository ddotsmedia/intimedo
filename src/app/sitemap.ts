import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { listCategoriesWithPublished, listPublishedEntries } from "@/lib/content/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  const [entries, categories] = await Promise.all([listPublishedEntries(prisma), listCategoriesWithPublished(prisma)]);
  return [
    { url: `${base}/a-z` },
    { url: `${base}/categories` },
    ...categories.map((c) => ({ url: `${base}/categories/${c.slug}` })),
    ...entries.map((e) => ({ url: `${base}/topics/${e.slug}` })),
  ];
}
