import Link from "next/link";
import { prisma } from "@/lib/db";
import { listPublishedEntries } from "@/lib/content/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "A–Z health topics" };

export default async function AZPage() {
  const entries = await listPublishedEntries(prisma);
  const groups = new Map<string, typeof entries>();
  for (const e of entries) groups.set(e.letter, [...(groups.get(e.letter) ?? []), e]);

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">A–Z health topics</h1>
      {entries.length === 0 && <p className="mt-4 text-[var(--color-muted)]">Reviewed articles will appear here.</p>}
      {[...groups.entries()].map(([letter, items]) => (
        <section key={letter} id={`letter-${letter}`} className="mt-8" aria-labelledby={`h-${letter}`}>
          <h2 id={`h-${letter}`} className="text-xl font-semibold">{letter}</h2>
          <ul className="mt-2 grid gap-2">
            {items.map((e) => (
              <li key={e.slug}><Link className="underline" href={`/topics/${e.slug}`}>{e.title}</Link></li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
