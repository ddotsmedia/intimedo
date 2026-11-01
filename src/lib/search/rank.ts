// Pure search ranking: no database access, so it is unit-testable.
export type Candidate = { slug: string; title: string; aliases: string[] };

// Lowercase, strip accents, collapse spaces. Used for both query and fields.
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

// Higher is better. Exact matches beat prefixes, prefixes beat substrings.
export function score(query: string, c: Candidate): number {
  const q = normalize(query);
  if (!q) return 0;
  const title = normalize(c.title);
  const aliases = c.aliases.map(normalize);
  if (title === q) return 100;
  if (aliases.includes(q)) return 90; // synonym exact
  if (title.startsWith(q)) return 70;
  if (aliases.some((a) => a.startsWith(q))) return 60;
  if (title.split(" ").some((w) => w.startsWith(q))) return 50;
  if (title.includes(q)) return 30;
  if (aliases.some((a) => a.includes(q))) return 20;
  // Every word of a multi-word query appears somewhere in the entry.
  const words = q.split(" ");
  const haystack = [title, ...aliases].join(" ");
  if (words.length > 1 && words.every((w) => haystack.includes(w))) return 10;
  return 0;
}

export function rank(query: string, candidates: Candidate[], limit = 20): Candidate[] {
  return candidates
    .map((c) => ({ c, s: score(query, c) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.c.title.localeCompare(b.c.title))
    .slice(0, limit)
    .map((x) => x.c);
}
