import type { PrismaClient } from "@/generated/prisma/client";

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
  return db.entry.findMany({
    where: {
      article: { status: "PUBLISHED" },
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { aliases: { some: { text: { contains: term, mode: "insensitive" } } } },
      ],
    },
    select: { slug: true, title: true },
    orderBy: { title: "asc" },
    take: 50,
  });
}
