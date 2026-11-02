import type { PrismaClient } from "@/generated/prisma/client";
import { rank } from "@/lib/search/rank";

// Public reads: only PUBLISHED articles are ever returned.
export async function listPublishedEntries(db: PrismaClient) {
  return db.entry.findMany({
    where: { article: { status: "PUBLISHED" } },
    select: { slug: true, title: true, letter: true },
    orderBy: { title: "asc" },
  });
}

export async function getPublishedArticle(db: PrismaClient, slug: string) {
  return db.entry.findFirst({
    where: { slug, article: { status: "PUBLISHED" } },
    include: {
      category: { select: { name: true, slug: true } },
      article: {
        include: {
          versions: { orderBy: { versionNumber: "desc" }, take: 1 },
          references: { include: { reference: true } },
        },
      },
    },
  });
}

export async function searchPublished(db: PrismaClient, query: string) {
  const term = query.trim().slice(0, 100);
  if (term.length < 2) return [];
  const rows = await db.entry.findMany({
    where: {
      article: { status: "PUBLISHED" },
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { aliases: { some: { text: { contains: term, mode: "insensitive" } } } },
      ],
    },
    select: { slug: true, title: true, aliases: { select: { text: true } } },
    take: 200,
  });
  return rank(
    term,
    rows.map((r) => ({ slug: r.slug, title: r.title, aliases: r.aliases.map((a) => a.text) })),
  ).map(({ slug, title }) => ({ slug, title }));
}

// Categories that have at least one published topic.
export async function listCategoriesWithPublished(db: PrismaClient) {
  return db.category.findMany({
    where: { entries: { some: { article: { status: "PUBLISHED" } } } },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryWithPublished(db: PrismaClient, slug: string) {
  const category = await db.category.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      entries: {
        where: { article: { status: "PUBLISHED" } },
        select: { slug: true, title: true },
        orderBy: { title: "asc" },
      },
    },
  });
  return category && category.entries.length > 0 ? category : null;
}
