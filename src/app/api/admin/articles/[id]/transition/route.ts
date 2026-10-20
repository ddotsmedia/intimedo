import { z } from "zod";
import { prisma } from "@/lib/db";
import { getEditor } from "@/lib/editorial/guard";
import { transitionArticle } from "@/lib/editorial/service";

export const dynamic = "force-dynamic";

const ACTIONS = ["submit_for_review", "medical_approve", "request_changes", "publish", "mark_needs_review", "archive"] as const;
const Body = z.object({ action: z.enum(ACTIONS) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const editor = await getEditor();
  if (!editor) return Response.json({ error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid_action" }, { status: 400 });

  const { id } = await params;
  const result = await transitionArticle(prisma, editor, id, parsed.data.action);
  if (!result.ok) {
    const status = result.reason === "not_found" ? 404 : result.reason === "invalid_transition" ? 409 : 403;
    return Response.json({ error: result.reason }, { status });
  }
  return Response.json({ status: result.to });
}
