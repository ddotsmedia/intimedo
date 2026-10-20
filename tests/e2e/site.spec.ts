import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/a-z", "/search", "/tools/bmi", "/tools/due-date", "/privacy", "/editorial-policy", "/disclaimer", "/admin/sign-in"];

for (const path of pages) {
  test(`no serious or critical WCAG 2.2 AA violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    const blocking = results.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id} (${v.nodes.length})`);
    expect(blocking).toEqual([]);
  });
}

test("admin transition rejects anonymous requests", async ({ request }) => {
  const res = await request.post("/api/admin/articles/none/transition", { data: { action: "publish" } });
  expect(res.status()).toBe(403);
});
