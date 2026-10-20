import { describe, expect, it } from "vitest";
import { isLocale, textDirection } from "../src/lib/i18n";

describe("i18n", () => {
  it("accepts only configured locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("xx")).toBe(false);
  });
  it("returns text direction per locale", () => {
    expect(textDirection("en")).toBe("ltr");
    expect(textDirection("ar")).toBe("rtl");
  });
});
