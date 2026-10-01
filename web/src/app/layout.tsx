import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "InfraPulse — Monitor everything. Respond faster.",
    template: "%s | InfraPulse",
  },
  description: "IT infrastructure monitoring and observability dashboard.",
};

const nav = [
  { href: "/", label: "Overview" },
  { href: "/hosts", label: "Hosts" },
  { href: "/alerts", label: "Alerts" },
  { href: "/incidents", label: "Incidents" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <aside className="hidden w-56 shrink-0 border-r border-line bg-panel/80 p-4 md:block">
            <Link href="/" className="block px-2 text-lg font-bold tracking-tight">
              Infra<span className="text-accent">Pulse</span>
            </Link>
            <p className="mt-1 px-2 text-[11px] uppercase tracking-wider text-muted">
              Observability
            </p>
            <nav className="mt-8 space-y-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-14 items-center justify-between border-b border-line px-4 md:px-6">
              <p className="text-sm text-muted md:hidden font-bold text-white">
                Infra<span className="text-accent">Pulse</span>
              </p>
              <p className="hidden text-sm text-muted md:block">
                Operations console · live simulated telemetry
              </p>
              <span className="rounded-full bg-ok/15 px-2.5 py-1 text-xs font-semibold text-ok">
                ● API connected
              </span>
            </header>
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
