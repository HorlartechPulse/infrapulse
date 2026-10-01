"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

type Incident = {
  id: string;
  title: string;
  severity: string;
  status: string;
  hostName: string;
  summary: string;
  createdAt: string;
};

type Check = {
  id: string;
  name: string;
  target: string;
  status: string;
  latencyMs: number;
  lastChecked: string;
};

export default function IncidentsPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [checks, setChecks] = useState<Check[]>([]);

  useEffect(() => {
    api<{ data: Incident[] }>("/incidents").then((r) => setItems(r.data)).catch(() => {});
    api<{ data: Check[] }>("/checks").then((r) => setChecks(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Incidents</h1>
        <p className="mt-1 text-sm text-muted">Correlated operational issues</p>
        <ul className="mt-6 space-y-3">
          {items.map((i) => (
            <li key={i.id} className="rounded-xl border border-line bg-panel/60 p-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={i.severity} />
                <StatusBadge status={i.status} />
              </div>
              <p className="mt-2 font-semibold">{i.title}</p>
              <p className="text-sm text-muted">{i.hostName}</p>
              <p className="mt-2 text-sm text-slate-300">{i.summary}</p>
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-muted">No open incidents</p>}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-bold">Synthetic checks</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {checks.map((c) => (
            <div key={c.id} className="rounded-xl border border-line bg-panel/60 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{c.name}</p>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-1 truncate text-xs text-muted">{c.target}</p>
              <p className="mt-2 text-sm">
                Latency <span className="font-mono text-accent">{c.latencyMs} ms</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
