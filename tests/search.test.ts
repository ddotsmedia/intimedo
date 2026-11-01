import { describe, expect, it } from "vitest";
import { normalize, rank, type Candidate } from "../src/lib/search/rank";

// Relevance test set: queries and the slug each must return first.
const corpus: Candidate[] = [
  { slug: "menstruation", title: "Menstruation", aliases: ["period", "periods"] },
  { slug: "contraception", title: "Contraception", aliases: ["birth control"] },
  { slug: "chlamydia", title: "Chlamydia", aliases: [] },
  { slug: "cervical-screening", title: "Cervical screening", aliases: ["pap smear", "pap test"] },
  { slug: "period-pain", title: "Period pain", aliases: ["dysmenorrhoea"] },
];

const relevance: [string, string][] = [
  ["birth control", "contraception"],
  ["pap smear", "cervical-screening"],
  ["PERIOD", "menstruation"],
  ["chlam", "chlamydia"],
  ["cervical", "cervical-screening"],
  ["Dysmenorrhoea", "period-pain"],
];

describe("search relevance", () => {
  for (const [query, slug] of relevance) {
    it(`"${query}" ranks ${slug} first`, () => {
      expect(rank(query, corpus)[0]?.slug).toBe(slug);
    });
  }

  it("returns nothing for unmatched text", () => {
    expect(rank("zzzz", corpus)).toEqual([]);
  });

  it("ignores case and accents", () => {
    expect(normalize("  Bébé   Health ")).toBe("bebe health");
  });

  it("matches a multi-word query across title and alias", () => {
    expect(rank("period pain", corpus)[0]?.slug).toBe("period-pain");
  });
});
