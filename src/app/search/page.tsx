import Link from "next/link";
import { prisma } from "@/lib/db";
import { searchPublished } from "@/lib/content/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = await searchPublished(prisma, q);

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Search</h1>
      <form action="/search" className="mt-4 flex gap-2" role="search">
        <label className="sr-only" htmlFor="q">Search topics</label>
        <input id="q" name="q" defaultValue={q} minLength={2} className="flex-1 rounded border border-[var(--color-border)] px-3 py-2" />
        <button type="submit" className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Search</button>
      </form>
      {q && results.length === 0 && <p className="mt-6">No published topics match “{q}”.</p>}
      <ul className="mt-6 grid gap-2">
        {results.map((r) => (
          <li key={r.slug}><Link className="underline" href={`/topics/${r.slug}`}>{r.title}</Link></li>
        ))}
      </ul>
    </main>
  );
}
