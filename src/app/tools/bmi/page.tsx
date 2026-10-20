"use client";

import { useState } from "react";
import { bmi } from "@/lib/tools/calculators";

export default function BmiPage() {
  const [result, setResult] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = bmi(Number(f.get("weight")), Number(f.get("height")));
    setResult(r.ok ? `BMI ${r.bmi} (${r.category}).` : "Please enter a weight of 20–400 kg and a height of 100–250 cm.");
  }

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">BMI calculator</h1>
      <p className="mt-3 text-[var(--color-muted)]">Body mass index is a rough screening measure for adults. It does not measure body fat, and it can mislead for muscular people, older adults, and some ethnic groups. It is not valid for children or during pregnancy.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1">Weight (kg)
          <input name="weight" type="number" step="0.1" required className="rounded border border-[var(--color-border)] px-3 py-2" />
        </label>
        <label className="grid gap-1">Height (cm)
          <input name="height" type="number" step="0.1" required className="rounded border border-[var(--color-border)] px-3 py-2" />
        </label>
        <button type="submit" className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Calculate</button>
      </form>
      {result && <p role="status" className="mt-4 text-lg">{result}</p>}
    </main>
  );
}
