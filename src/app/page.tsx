import en from "../../messages/en.json";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{en.home.title}</h1>
      <p className="mt-3 text-[var(--color-muted)]">{en.home.intro}</p>
      <nav aria-label="A to Z index" className="mt-6 flex flex-wrap gap-2">
        {letters.map((letter) => (
          <span
            key={letter}
            aria-disabled="true"
            className="rounded-[var(--radius)] border border-[var(--color-border)] px-3 py-1 text-[var(--color-muted)]"
          >
            {letter}
          </span>
        ))}
      </nav>
      <aside className="mt-10 rounded-[var(--radius)] border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
        {en.home.disclaimer}
      </aside>
    </main>
  );
}
