"use client";

import { useEffect, useState } from "react";
import { api, postApi } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

type Alert = {
  id: string;
  hostName: string;
  title: string;
  severity: string;
  status: string;
  metric: string;
  value: number;
  threshold: number;
  createdAt: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState("");

  const load = () =>
    api<{ data: Alert[] }>("/alerts")
      .then((r) => setAlerts(r.data))
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const ack = async (id: string) => {
    await postApi(`/alerts/${id}/ack`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Alert console</h1>
      <p className="mt-1 text-sm text-muted">Threshold breaches from the monitoring API</p>
      {error && <p className="mt-4 text-sm text-crit">{error}</p>}
      <ul className="mt-6 space-y-3">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel/60 p-4"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={a.severity} />
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-2 font-semibold">{a.title}</p>
              <p className="text-sm text-muted">
                {a.hostName} · {a.metric} {a.value} (threshold {a.threshold})
              </p>
              <p className="mt-1 text-xs text-muted">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
            {a.status === "firing" && (
              <button
                type="button"
                onClick={() => ack(a.id)}
                className="rounded-lg bg-accent/20 px-3 py-1.5 text-xs font-semibold text-accent"
              >
                Acknowledge
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
