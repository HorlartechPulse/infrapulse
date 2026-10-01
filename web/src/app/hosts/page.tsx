"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

type Host = {
  id: string;
  name: string;
  role: string;
  environment: string;
  region: string;
  status: string;
  ip: string;
  cpu: number;
  memory: number;
  disk: number;
  load: number;
  uptimeHours: number;
};

export default function HostsPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ data: Host[] }>("/hosts")
      .then((r) => setHosts(r.data))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Hosts</h1>
      <p className="mt-1 text-sm text-muted">Inventory and live resource utilization</p>
      {error && <p className="mt-4 text-sm text-crit">{error}</p>}
      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-panel/60">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Env</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">CPU</th>
              <th className="p-3 font-medium">Memory</th>
              <th className="p-3 font-medium">Disk</th>
              <th className="p-3 font-medium">Load</th>
              <th className="p-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((h) => (
              <tr key={h.id} className="border-t border-line/50">
                <td className="p-3 font-medium">{h.name}</td>
                <td className="p-3 text-muted">{h.role}</td>
                <td className="p-3 text-muted">{h.environment}</td>
                <td className="p-3">
                  <StatusBadge status={h.status} />
                </td>
                <td className="p-3">{h.cpu.toFixed(1)}%</td>
                <td className="p-3">{h.memory.toFixed(1)}%</td>
                <td className="p-3">{h.disk.toFixed(1)}%</td>
                <td className="p-3">{h.load.toFixed(2)}</td>
                <td className="p-3 font-mono text-xs text-muted">{h.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
