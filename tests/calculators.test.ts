import { describe, expect, it } from "vitest";
import { bmi, dueDateFromLmp } from "../src/lib/tools/calculators";

describe("bmi", () => {
  it("classifies WHO adult categories", () => {
    expect(bmi(70, 175)).toEqual({ ok: true, bmi: 22.9, category: "healthy weight" });
    expect(bmi(50, 175)).toMatchObject({ ok: true, category: "underweight" });
    expect(bmi(90, 175)).toMatchObject({ ok: true, category: "overweight" });
    expect(bmi(100, 175)).toMatchObject({ ok: true, category: "obesity" });
  });
  it("rejects implausible input", () => {
    expect(bmi(5, 175)).toEqual({ ok: false, reason: "invalid_input" });
    expect(bmi(70, 50)).toEqual({ ok: false, reason: "invalid_input" });
    expect(bmi(Number.NaN, 175)).toEqual({ ok: false, reason: "invalid_input" });
  });
});

describe("due date", () => {
  const today = new Date("2026-10-20T12:00:00Z");
  it("adds 280 days to LMP and reports gestational age", () => {
    expect(dueDateFromLmp("2026-07-13", today)).toEqual({ ok: true, dueDate: "2027-04-19", gestationalWeeks: 14, gestationalDays: 1 });
  });
  it("rejects future and implausibly old dates", () => {
    expect(dueDateFromLmp("2026-11-01", today)).toEqual({ ok: false, reason: "out_of_range" });
    expect(dueDateFromLmp("2025-01-01", today)).toEqual({ ok: false, reason: "out_of_range" });
    expect(dueDateFromLmp("not-a-date", today)).toEqual({ ok: false, reason: "invalid_date" });
  });
});
