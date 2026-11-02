import Link from "next/link";
import { prisma } from "@/lib/db";
import { listCategoriesWithPublished } from "@/lib/content/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await listCategoriesWithPublished(prisma);
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Categories</h1>
      {categories.length === 0 && <p className="mt-6">No topics are published yet.</p>}
      <ul className="mt-6 grid gap-2">
        {categories.map((c) => (
          <li key={c.slug}><Link className="underline" href={`/categories/${c.slug}`}>{c.name}</Link></li>
        ))}
      </ul>
    </main>
  );
}
