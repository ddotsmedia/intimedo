"use client";

import { useState } from "react";
import { dueDateFromLmp } from "@/lib/tools/calculators";

export default function DueDatePage() {
  const [result, setResult] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = dueDateFromLmp(String(f.get("lmp")), new Date());
    setResult(
      r.ok
        ? `Estimated due date: ${r.dueDate}. Gestational age today: ${r.gestationalWeeks} weeks ${r.gestationalDays} days.`
        : "Please enter a date within the last 300 days.",
    );
  }

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Due date estimate</h1>
      <p className="mt-3 text-[var(--color-muted)]">This estimate adds 280 days to the first day of your last menstrual period. It assumes a 28-day cycle. Only an ultrasound scan in pregnancy can date a pregnancy reliably. Ask a clinician for confirmation.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1">First day of last period
          <input name="lmp" type="date" required className="rounded border border-[var(--color-border)] px-3 py-2" />
        </label>
        <button type="submit" className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Estimate</button>
      </form>
      {result && <p role="status" className="mt-4 text-lg">{result}</p>}
    </main>
  );
}
