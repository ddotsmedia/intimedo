"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

const client = createAuthClient({ plugins: [twoFactorClient()] });

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [needsCode, setNeedsCode] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    if (needsCode) {
      const r = await client.twoFactor.verifyTotp({ code: String(f.get("code")) });
      if (r.error) return setError("Invalid code.");
    } else {
      const r = await client.signIn.email({ email: String(f.get("email")), password: String(f.get("password")) });
      if (r.error) return setError("Sign-in failed.");
      if (r.data && "twoFactorRedirect" in r.data && r.data.twoFactorRedirect) return setNeedsCode(true);
    }
    window.location.href = "/admin";
  }

  return (
    <main id="main" className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Editor sign-in</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        {needsCode ? (
          <label className="grid gap-1">Authenticator code
            <input name="code" inputMode="numeric" autoComplete="one-time-code" required className="rounded border border-[var(--color-border)] px-3 py-2" />
          </label>
        ) : (
          <>
            <label className="grid gap-1">Email
              <input name="email" type="email" autoComplete="username" required className="rounded border border-[var(--color-border)] px-3 py-2" />
            </label>
            <label className="grid gap-1">Password
              <input name="password" type="password" autoComplete="current-password" required className="rounded border border-[var(--color-border)] px-3 py-2" />
            </label>
          </>
        )}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Continue</button>
      </form>
    </main>
  );
}
