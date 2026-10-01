"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  AlertTriangle,
  Server,
  Siren,
  Cpu,
  HardDrive,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

type Overview = {
  hostsTotal: number;
  hostsUp: number;
  hostsDegraded: number;
  hostsDown: number;
  alertsFiring: number;
  openIncidents: number;
  avgCpu: number;
  avgMem: number;
  checksFailing: number;
  generatedAt: string;
};

type Host = {
  id: string;
  name: string;
  role: string;
  status: string;
  cpu: number;
  memory: number;
  region: string;
};

type Alert = {
  id: string;
  title: string;
  severity: string;
  status: string;
  hostName: string;
};

export default function OverviewPage() {
  const [ov, setOv] = useState<Overview | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [points, setPoints] = useState<{ ts: string; value: number }[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [o, h, a, s] = await Promise.all([
        api<{ data: Overview }>("/overview"),
        api<{ data: Host[] }>("/hosts"),
        api<{ data: Alert[] }>("/alerts"),
        api<{ data: { points: { ts: string; value: number }[] } }>(
          "/metrics/series?metric=cpu_usage_percent"
        ),
      ]);
      setOv(o.data);
      setHosts(h.data.slice(0, 6));
      setAlerts(a.data.filter((x) => x.status === "firing").slice(0, 5));
      setPoints(
        s.data.points.map((p) => ({
          ts: new Date(p.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          value: p.value,
        }))
      );
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "API unavailable");
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  const kpis = ov
    ? [
        { label: "Hosts up", value: `${ov.hostsUp}/${ov.hostsTotal}`, icon: Server, tone: "text-ok" },
        { label: "Firing alerts", value: ov.alertsFiring, icon: AlertTriangle, tone: "text-warn" },
        { label: "Open incidents", value: ov.openIncidents, icon: Siren, tone: "text-crit" },
        { label: "Avg CPU", value: `${ov.avgCpu}%`, icon: Cpu, tone: "text-accent" },
        { label: "Avg memory", value: `${ov.avgMem}%`, icon: HardDrive, tone: "text-accent" },
        { label: "Checks failing", value: ov.checksFailing, icon: Activity, tone: "text-crit" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-line">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80"
            alt="Server infrastructure"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />
        <div className="relative px-6 py-10 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Infrastructure monitoring
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Monitor everything. Respond faster.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            Live operations dashboard for hosts, metrics, alerts, and incidents — powered by the
            InfraPulse REST API.
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-crit/30 bg-crit/10 px-4 py-3 text-sm text-crit">
          {error} — start the backend on :4900
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-line bg-panel/60 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">{k.label}</p>
              <k.icon className={`h-4 w-4 ${k.tone}`} />
            </div>
            <p className="mt-2 text-2xl font-bold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-line bg-panel/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">CPU utilization (fleet)</h2>
            <span className="text-xs text-muted">series from API</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="ts" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1f2937",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Firing alerts</h2>
            <Link href="/alerts" className="text-xs text-accent">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-line/80 bg-ink/40 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted">{a.hostName}</p>
                </div>
                <StatusBadge status={a.severity} />
              </li>
            ))}
            {alerts.length === 0 && (
              <p className="text-sm text-muted">No firing alerts</p>
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-panel/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Host snapshot</h2>
          <Link href="/hosts" className="text-xs text-accent">
            All hosts
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="pb-2 pr-4 font-medium">Host</th>
                <th className="pb-2 pr-4 font-medium">Role</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">CPU</th>
                <th className="pb-2 pr-4 font-medium">Mem</th>
                <th className="pb-2 font-medium">Region</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((h) => (
                <tr key={h.id} className="border-t border-line/60">
                  <td className="py-2.5 pr-4 font-medium">{h.name}</td>
                  <td className="py-2.5 pr-4 text-muted">{h.role}</td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge status={h.status} />
                  </td>
                  <td className="py-2.5 pr-4">{h.cpu.toFixed(1)}%</td>
                  <td className="py-2.5 pr-4">{h.memory.toFixed(1)}%</td>
                  <td className="py-2.5 text-muted">{h.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
