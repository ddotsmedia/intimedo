import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategoryWithPublished } from "@/lib/content/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryWithPublished(prisma, slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryWithPublished(prisma, slug);
  if (!category) notFound();

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm"><Link className="underline" href="/categories">All categories</Link></p>
      <h1 className="mt-2 text-3xl font-semibold">{category.name}</h1>
      <ul className="mt-6 grid gap-2">
        {category.entries.map((e) => (
          <li key={e.slug}><Link className="underline" href={`/topics/${e.slug}`}>{e.title}</Link></li>
        ))}
      </ul>
    </main>
  );
}
