// Pure editorial rules. Enforced server-side by callers; no I/O here.
export type Role = "READER" | "AUTHOR" | "MEDICAL_REVIEWER" | "SENIOR_EDITOR" | "ADMIN";
export type Status =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "MEDICALLY_REVIEWED"
  | "PUBLISHED"
  | "NEEDS_REVIEW"
  | "ARCHIVED";
export type Action =
  | "submit_for_review"
  | "medical_approve"
  | "request_changes"
  | "publish"
  | "mark_needs_review"
  | "archive";

type Rule = {
  from: Status;
  action: Action;
  to: Status;
  roles: readonly Role[];
  // true when the actor must not be the article's author (separation of duties)
  notAuthor: boolean;
};

const REVIEW_ROLES: readonly Role[] = ["MEDICAL_REVIEWER", "SENIOR_EDITOR", "ADMIN"];
const PUBLISH_ROLES: readonly Role[] = ["SENIOR_EDITOR", "ADMIN"];
const WRITE_ROLES: readonly Role[] = ["AUTHOR", "MEDICAL_REVIEWER", "SENIOR_EDITOR", "ADMIN"];

export const RULES: readonly Rule[] = [
  { from: "DRAFT", action: "submit_for_review", to: "UNDER_REVIEW", roles: WRITE_ROLES, notAuthor: false },
  { from: "NEEDS_REVIEW", action: "submit_for_review", to: "UNDER_REVIEW", roles: WRITE_ROLES, notAuthor: false },
  { from: "UNDER_REVIEW", action: "medical_approve", to: "MEDICALLY_REVIEWED", roles: REVIEW_ROLES, notAuthor: true },
  { from: "UNDER_REVIEW", action: "request_changes", to: "DRAFT", roles: REVIEW_ROLES, notAuthor: true },
  { from: "MEDICALLY_REVIEWED", action: "publish", to: "PUBLISHED", roles: PUBLISH_ROLES, notAuthor: true },
  { from: "MEDICALLY_REVIEWED", action: "request_changes", to: "DRAFT", roles: REVIEW_ROLES, notAuthor: true },
  { from: "PUBLISHED", action: "mark_needs_review", to: "NEEDS_REVIEW", roles: REVIEW_ROLES, notAuthor: false },
  { from: "PUBLISHED", action: "archive", to: "ARCHIVED", roles: PUBLISH_ROLES, notAuthor: false },
];

export type Decision =
  | { ok: true; to: Status }
  | { ok: false; reason: "invalid_transition" | "forbidden_role" | "author_cannot_approve" };

export function decide(input: {
  from: Status;
  action: Action;
  role: Role;
  actorIsAuthor: boolean;
}): Decision {
  const rule = RULES.find((r) => r.from === input.from && r.action === input.action);
  if (!rule) return { ok: false, reason: "invalid_transition" };
  if (!rule.roles.includes(input.role)) return { ok: false, reason: "forbidden_role" };
  if (rule.notAuthor && input.actorIsAuthor) return { ok: false, reason: "author_cannot_approve" };
  return { ok: true, to: rule.to };
}
