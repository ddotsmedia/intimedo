import type { Metadata } from "next";
import "./globals.css";
import { defaultLocale, textDirection } from "@/lib/i18n";
import en from "../../messages/en.json";

export const metadata: Metadata = {
  title: en.site.name,
  description: en.site.tagline,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} dir={textDirection(defaultLocale)}>
      <body className="min-h-screen antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:p-2">Skip to content</a>
        <header className="border-b border-[var(--color-border)] px-4 py-4">
          <p className="text-lg font-semibold text-[var(--color-primary)]">{en.site.name}</p>
        </header>
        {children}
      </body>
    </html>
  );
}
