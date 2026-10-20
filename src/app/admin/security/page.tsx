"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

const client = createAuthClient({ plugins: [twoFactorClient()] });

// Two-factor enrolment for editorial roles.
export default function Security() {
  const [uri, setUri] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function enable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await client.twoFactor.enable({ password: String(f.get("password")) });
    if (r.error || !r.data) return setMessage("Could not start two-factor setup.");
    setUri(r.data.totpURI);
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await client.twoFactor.verifyTotp({ code: String(f.get("code")) });
    setMessage(r.error ? "Invalid code." : "Two-factor enabled. You can now use the dashboard.");
  }

  return (
    <main id="main" className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Two-factor authentication</h1>
      {!uri ? (
        <form onSubmit={enable} className="mt-6 grid gap-4">
          <label className="grid gap-1">Password
            <input name="password" type="password" autoComplete="current-password" required className="rounded border border-[var(--color-border)] px-3 py-2" />
          </label>
          <button type="submit" className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Start setup</button>
        </form>
      ) : (
        <div className="mt-6 grid gap-4">
          <p className="text-sm break-all">Add this to your authenticator app: <code>{uri}</code></p>
          <form onSubmit={verify} className="grid gap-4">
            <label className="grid gap-1">Code from app
              <input name="code" inputMode="numeric" autoComplete="one-time-code" required className="rounded border border-[var(--color-border)] px-3 py-2" />
            </label>
            <button type="submit" className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Verify</button>
          </form>
        </div>
      )}
      {message && <p role="status" className="mt-4 text-sm">{message}</p>}
    </main>
  );
}
