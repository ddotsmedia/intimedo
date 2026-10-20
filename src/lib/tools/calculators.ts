// Pure educational calculators. Outputs are estimates, not diagnoses.

export type BmiResult =
  | { ok: true; bmi: number; category: "underweight" | "healthy weight" | "overweight" | "obesity" }
  | { ok: false; reason: "invalid_input" };

// Adult BMI categories as defined by WHO. Not valid for children or pregnancy.
export function bmi(weightKg: number, heightCm: number): BmiResult {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return { ok: false, reason: "invalid_input" };
  if (weightKg < 20 || weightKg > 400 || heightCm < 100 || heightCm > 250) return { ok: false, reason: "invalid_input" };
  const m = heightCm / 100;
  const value = Math.round((weightKg / (m * m)) * 10) / 10;
  const category = value < 18.5 ? "underweight" : value < 25 ? "healthy weight" : value < 30 ? "overweight" : "obesity";
  return { ok: true, bmi: value, category };
}

const DAY_MS = 24 * 60 * 60 * 1000;

export type DueDateResult =
  | { ok: true; dueDate: string; gestationalWeeks: number; gestationalDays: number }
  | { ok: false; reason: "invalid_date" | "out_of_range" };

// Estimated due date from the first day of the last menstrual period (LMP): LMP + 280 days.
// Gestational age is counted from LMP. Assumes a 28-day cycle; cycle length changes the estimate.
export function dueDateFromLmp(lmpIso: string, today: Date): DueDateResult {
  const lmp = new Date(`${lmpIso}T00:00:00Z`);
  if (Number.isNaN(lmp.getTime())) return { ok: false, reason: "invalid_date" };
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const days = Math.floor((todayUtc - lmp.getTime()) / DAY_MS);
  if (days < 0 || days > 300) return { ok: false, reason: "out_of_range" };
  const due = new Date(lmp.getTime() + 280 * DAY_MS);
  return {
    ok: true,
    dueDate: due.toISOString().slice(0, 10),
    gestationalWeeks: Math.floor(days / 7),
    gestationalDays: days % 7,
  };
}
