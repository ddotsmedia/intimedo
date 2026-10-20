import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/db";
import { getPublishedArticle, listPublishedEntries, searchPublished } from "../src/lib/content/queries";

const run = process.env.DATABASE_URL ? describe : describe.skip;
const tag = `p${Date.now()}`;

run("public content visibility (database)", () => {
  const draftSlug = `${tag}-draft`;
  const pubSlug = `${tag}-pub`;
  let catId = "";

  it("returns only published articles", async () => {
    const cat = await prisma.category.create({ data: { slug: `${tag}-c`, name: "C" } });
    catId = cat.id;
    const draft = await prisma.entry.create({ data: { slug: draftSlug, title: `${tag} Draft`, letter: "D", categoryId: cat.id } });
    const pub = await prisma.entry.create({ data: { slug: pubSlug, title: `${tag} Pub`, letter: "P", categoryId: cat.id, aliases: { create: [{ text: `${tag}alias`, normalized: `${tag}alias-norm` }] } } });
    await prisma.article.create({ data: { entryId: draft.id, status: "DRAFT" } });
    await prisma.article.create({ data: { entryId: pub.id, status: "PUBLISHED", publishedAt: new Date() } });

    const listed = (await listPublishedEntries(prisma)).map((e) => e.slug);
    expect(listed).toContain(pubSlug);
    expect(listed).not.toContain(draftSlug);
    expect(await getPublishedArticle(prisma, draftSlug)).toBeNull();
    expect((await getPublishedArticle(prisma, pubSlug))?.slug).toBe(pubSlug);
    expect((await searchPublished(prisma, `${tag}`)).map((r) => r.slug)).toEqual([pubSlug]);
  });

  afterAll(async () => {
    await prisma.article.deleteMany({ where: { entry: { slug: { in: [draftSlug, pubSlug] } } } });
    await prisma.entry.deleteMany({ where: { slug: { in: [draftSlug, pubSlug] } } });
    await prisma.category.deleteMany({ where: { id: catId } });
    await prisma.$disconnect();
  });
});
