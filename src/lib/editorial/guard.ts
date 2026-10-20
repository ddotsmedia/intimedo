import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { Role } from "./workflow";

export const EDITORIAL_ROLES: readonly Role[] = ["AUTHOR", "MEDICAL_REVIEWER", "SENIOR_EDITOR", "ADMIN"];

export type Editor = { id: string; role: Role };

// Returns the editor only if signed in, editorial role, and two-factor enabled.
export async function getEditor(): Promise<Editor | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = session.user as { id: string; role: Role; twoFactorEnabled?: boolean | null };
  if (!EDITORIAL_ROLES.includes(user.role) || !user.twoFactorEnabled) return null;
  return { id: user.id, role: user.role };
}
