import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-[var(--color-muted)]">The page you asked for does not exist or has moved.</p>
      <ul className="mt-6 grid gap-2">
        <li><Link className="underline" href="/">Home</Link></li>
        <li><Link className="underline" href="/a-z">A to Z index</Link></li>
        <li><Link className="underline" href="/search">Search all topics</Link></li>
        <li><Link className="underline" href="/categories">Browse by category</Link></li>
      </ul>
    </main>
  );
}
