import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { listPublishedEntries } from "@/lib/content/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  const entries = await listPublishedEntries(prisma);
  return [
    { url: `${base}/a-z` },
    ...entries.map((e) => ({ url: `${base}/topics/${e.slug}` })),
  ];
}
