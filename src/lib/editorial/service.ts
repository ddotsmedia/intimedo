import type { PrismaClient } from "@/generated/prisma/client";
import { decide, type Action, type Role, type Status } from "./workflow";

export type Actor = { id: string; role: Role };

// Applies one workflow action atomically and writes an audit entry.
export async function transitionArticle(db: PrismaClient, actor: Actor, articleId: string, action: Action) {
  return db.$transaction(async (tx) => {
    const article = await tx.article.findUnique({ where: { id: articleId } });
    if (!article) return { ok: false as const, reason: "not_found" as const };

    // Author = creator of the first version.
    const first = await tx.articleVersion.findFirst({
      where: { articleId },
      orderBy: { versionNumber: "asc" },
      select: { createdById: true },
    });

    const decision = decide({
      from: article.status as Status,
      action,
      role: actor.role,
      actorIsAuthor: first?.createdById === actor.id,
    });
    if (!decision.ok) return decision;

    await tx.article.update({
      where: { id: articleId },
      data: {
        status: decision.to,
        ...(decision.to === "MEDICALLY_REVIEWED" ? { reviewerId: actor.id } : {}),
        ...(decision.to === "PUBLISHED" ? { publishedAt: new Date() } : {}),
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        action,
        targetType: "Article",
        targetId: articleId,
        detail: `${article.status} -> ${decision.to}`,
      },
    });
    return { ok: true as const, to: decision.to };
  });
}
