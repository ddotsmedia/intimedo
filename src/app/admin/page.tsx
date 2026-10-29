import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EDITORIAL_ROLES, getEditor } from "@/lib/editorial/guard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const editor = await getEditor();
  if (!editor) {
    // Signed in with an editorial role but no two-factor yet: send to enrolment.
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
    const user = session?.user as { role?: string; twoFactorEnabled?: boolean | null } | undefined;
    if (user && (EDITORIAL_ROLES as readonly string[]).includes(user.role ?? "") && !user.twoFactorEnabled) {
      redirect("/admin/security");
    }
    redirect("/admin/sign-in");
  }

  const articles = await prisma.article.findMany({
    include: { entry: { select: { title: true, slug: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Editorial dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Role: {editor.role}</p>
      <table className="mt-6 w-full text-left text-sm">
        <caption className="sr-only">Articles and status</caption>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th scope="col" className="py-2">Title</th>
            <th scope="col" className="py-2">Status</th>
            <th scope="col" className="py-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-b border-[var(--color-border)]">
              <td className="py-2">{a.entry.title}</td>
              <td className="py-2">{a.status}</td>
              <td className="py-2">{a.updatedAt.toISOString().slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
