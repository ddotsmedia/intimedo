import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/db";
import { transitionArticle } from "../src/lib/editorial/service";

const run = process.env.DATABASE_URL ? describe : describe.skip;
const tag = `t${Date.now()}`;

run("transitionArticle (database)", () => {
  let articleId = "";
  const ids = { author: `${tag}-a`, reviewer: `${tag}-r`, senior: `${tag}-s` };

  it("enforces the workflow and writes audit entries", async () => {
    await prisma.user.createMany({ data: [
      { id: ids.author, name: "A", email: `${ids.author}@test.local`, role: "AUTHOR", updatedAt: new Date() },
      { id: ids.reviewer, name: "R", email: `${ids.reviewer}@test.local`, role: "MEDICAL_REVIEWER", updatedAt: new Date() },
      { id: ids.senior, name: "S", email: `${ids.senior}@test.local`, role: "SENIOR_EDITOR", updatedAt: new Date() },
    ] });
    const cat = await prisma.category.create({ data: { slug: `${tag}-c`, name: "C" } });
    const entry = await prisma.entry.create({ data: { slug: `${tag}-e`, title: "T", letter: "T", categoryId: cat.id } });
    const article = await prisma.article.create({ data: { entryId: entry.id } });
    articleId = article.id;
    await prisma.articleVersion.create({ data: { articleId, versionNumber: 1, summary: "s", bodyMd: "b", createdById: ids.author } });

    expect(await transitionArticle(prisma, { id: ids.author, role: "AUTHOR" }, articleId, "submit_for_review")).toMatchObject({ ok: true, to: "UNDER_REVIEW" });
    expect(await transitionArticle(prisma, { id: ids.author, role: "AUTHOR" }, articleId, "medical_approve")).toMatchObject({ ok: false, reason: "forbidden_role" });
    expect(await transitionArticle(prisma, { id: ids.reviewer, role: "MEDICAL_REVIEWER" }, articleId, "publish")).toMatchObject({ ok: false, reason: "invalid_transition" });
    expect(await transitionArticle(prisma, { id: ids.reviewer, role: "MEDICAL_REVIEWER" }, articleId, "medical_approve")).toMatchObject({ ok: true, to: "MEDICALLY_REVIEWED" });
    expect(await transitionArticle(prisma, { id: ids.reviewer, role: "MEDICAL_REVIEWER" }, articleId, "publish")).toMatchObject({ ok: false, reason: "forbidden_role" });
    expect(await transitionArticle(prisma, { id: ids.senior, role: "SENIOR_EDITOR" }, articleId, "publish")).toMatchObject({ ok: true, to: "PUBLISHED" });

    const logs = await prisma.auditLog.count({ where: { targetId: articleId } });
    expect(logs).toBe(3);
  });

  afterAll(async () => {
    if (!articleId) return;
    await prisma.auditLog.deleteMany({ where: { targetId: articleId } });
    await prisma.articleVersion.deleteMany({ where: { articleId } });
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (article) {
      await prisma.article.delete({ where: { id: articleId } });
      await prisma.entry.delete({ where: { id: article.entryId } });
      await prisma.category.deleteMany({ where: { slug: `${tag}-c` } });
    }
    await prisma.user.deleteMany({ where: { id: { in: Object.values(ids) } } });
    await prisma.$disconnect();
  });
});
