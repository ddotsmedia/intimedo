import { describe, expect, it } from "vitest";
import { decide } from "../src/lib/editorial/workflow";

describe("editorial workflow", () => {
  it("moves a draft to review", () => {
    expect(decide({ from: "DRAFT", action: "submit_for_review", role: "AUTHOR", actorIsAuthor: true })).toEqual({ ok: true, to: "UNDER_REVIEW" });
  });
  it("blocks readers from submitting", () => {
    expect(decide({ from: "DRAFT", action: "submit_for_review", role: "READER", actorIsAuthor: false })).toEqual({ ok: false, reason: "forbidden_role" });
  });
  it("blocks authors from approving their own article", () => {
    expect(decide({ from: "UNDER_REVIEW", action: "medical_approve", role: "MEDICAL_REVIEWER", actorIsAuthor: true })).toEqual({ ok: false, reason: "author_cannot_approve" });
  });
  it("allows a different reviewer to approve", () => {
    expect(decide({ from: "UNDER_REVIEW", action: "medical_approve", role: "MEDICAL_REVIEWER", actorIsAuthor: false })).toEqual({ ok: true, to: "MEDICALLY_REVIEWED" });
  });
  it("never publishes without medical approval", () => {
    expect(decide({ from: "UNDER_REVIEW", action: "publish", role: "ADMIN", actorIsAuthor: false })).toEqual({ ok: false, reason: "invalid_transition" });
  });
  it("only senior editors and admins publish", () => {
    expect(decide({ from: "MEDICALLY_REVIEWED", action: "publish", role: "MEDICAL_REVIEWER", actorIsAuthor: false })).toEqual({ ok: false, reason: "forbidden_role" });
    expect(decide({ from: "MEDICALLY_REVIEWED", action: "publish", role: "SENIOR_EDITOR", actorIsAuthor: false })).toEqual({ ok: true, to: "PUBLISHED" });
  });
  it("flags published content for re-review", () => {
    expect(decide({ from: "PUBLISHED", action: "mark_needs_review", role: "MEDICAL_REVIEWER", actorIsAuthor: false })).toEqual({ ok: true, to: "NEEDS_REVIEW" });
  });
});
