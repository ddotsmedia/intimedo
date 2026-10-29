import { expect, test } from "@playwright/test";
import { prisma } from "../../src/lib/db";

const email = `editor-${Date.now()}@example.test`;
const password = "correct-horse-battery-1";

test.beforeAll(async ({ request }) => {
  const res = await request.post("/api/auth/sign-up/email", {
    headers: { origin: "http://127.0.0.1:3100" },
    data: { email, password, name: "Test Editor" },
  });
  expect(res.ok()).toBeTruthy();
  await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
});

test("anonymous dashboard request goes to sign-in", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/sign-in$/);
});

test("wrong password is rejected", async ({ page }) => {
  await page.goto("/admin/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("wrong-password-value");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("alert")).toHaveText("Sign-in failed.");
});

test("editor without two-factor is sent to enrolment, not the dashboard", async ({ page }) => {
  await page.goto("/admin/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/admin\/security$/);
  await expect(page.getByRole("heading", { name: "Two-factor authentication" })).toBeVisible();
});
