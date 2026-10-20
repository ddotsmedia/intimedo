import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/db";
import { getPublishedArticle } from "@/lib/content/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getPublishedArticle(prisma, slug);
  if (!entry) return { title: "Not found" };
  const version = entry.article?.versions[0];
  return {
    title: entry.title,
    description: version?.summary,
    alternates: { canonical: `/topics/${entry.slug}` },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getPublishedArticle(prisma, slug);
  if (!entry?.article) notFound();

  const article = entry.article;
  const version = article.versions[0];
  const reviewed = article.publishedAt ? article.publishedAt.toISOString().slice(0, 10) : null;

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-muted)]">
        <a href="/a-z">A–Z</a> / {entry.category.name}
      </nav>
      <h1 className="mt-2 text-3xl font-semibold">{entry.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Status: medically reviewed{reviewed ? `, published ${reviewed}` : ""}. Version {version?.versionNumber ?? 1}.
      </p>
      {version && <p className="mt-4 text-lg">{version.summary}</p>}
      <article className="mt-8 grid gap-3">
        <ReactMarkdown>{version?.bodyMd ?? ""}</ReactMarkdown>
      </article>
      {article.references.length > 0 && (
        <section aria-labelledby="sources" className="mt-10">
          <h2 id="sources" className="text-xl font-semibold">Sources</h2>
          <ol className="mt-3 list-decimal pl-6 text-sm">
            {article.references.map((r) => (
              <li key={r.referenceId} className="mt-2">
                {r.reference.url ? <a className="underline" href={r.reference.url}>{r.reference.citation}</a> : r.reference.citation}
                <span className="text-[var(--color-muted)]"> — {r.claimNote} (accessed {r.reference.accessedAt.toISOString().slice(0, 10)})</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      <aside className="mt-10 rounded-[var(--radius)] border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
        This is general education, not individual medical advice. If you have symptoms or concerns, speak with a qualified health professional. In an emergency, call your local emergency number.
      </aside>
    </main>
  );
}
