import { randomUUID } from "crypto";

export type Severity = "info" | "warning" | "critical";
export type HostStatus = "up" | "degraded" | "down";

export type Host = {
  id: string;
  name: string;
  role: string;
  environment: string;
  region: string;
  status: HostStatus;
  ip: string;
  cpu: number;
  memory: number;
  disk: number;
  load: number;
  uptimeHours: number;
  lastSeen: string;
};

export type Alert = {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  severity: Severity;
  status: "firing" | "acknowledged" | "resolved";
  metric: string;
  value: number;
  threshold: number;
  createdAt: string;
  acknowledgedAt?: string;
};

export type Incident = {
  id: string;
  title: string;
  severity: Severity;
  status: "open" | "investigating" | "resolved";
  hostName: string;
  alertId: string;
  createdAt: string;
  summary: string;
};

export type MetricPoint = { ts: string; value: number };

export type ServiceCheck = {
  id: string;
  name: string;
  target: string;
  status: "pass" | "fail";
  latencyMs: number;
  lastChecked: string;
};

const now = () => new Date().toISOString();

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function jitter(base: number, spread: number) {
  return base + (Math.random() - 0.5) * spread;
}

const seedHosts: Omit<Host, "lastSeen" | "cpu" | "memory" | "disk" | "load" | "status">[] = [
  { id: "h1", name: "web-01", role: "web", environment: "prod", region: "eu-west", ip: "10.0.1.11", uptimeHours: 1820 },
  { id: "h2", name: "web-02", role: "web", environment: "prod", region: "eu-west", ip: "10.0.1.12", uptimeHours: 900 },
  { id: "h3", name: "api-01", role: "app", environment: "prod", region: "eu-west", ip: "10.0.2.21", uptimeHours: 2100 },
  { id: "h4", name: "api-02", role: "app", environment: "prod", region: "eu-central", ip: "10.0.2.22", uptimeHours: 640 },
  { id: "h5", name: "db-primary", role: "database", environment: "prod", region: "eu-west", ip: "10.0.3.31", uptimeHours: 4200 },
  { id: "h6", name: "db-replica", role: "database", environment: "prod", region: "eu-west", ip: "10.0.3.32", uptimeHours: 4000 },
  { id: "h7", name: "cache-01", role: "cache", environment: "prod", region: "eu-west", ip: "10.0.4.41", uptimeHours: 1200 },
  { id: "h8", name: "worker-01", role: "worker", environment: "prod", region: "eu-central", ip: "10.0.5.51", uptimeHours: 800 },
  { id: "h9", name: "staging-web", role: "web", environment: "staging", region: "eu-west", ip: "10.1.1.11", uptimeHours: 200 },
  { id: "h10", name: "bastion", role: "ops", environment: "prod", region: "eu-west", ip: "10.0.0.5", uptimeHours: 5000 },
];

function baseline(role: string) {
  switch (role) {
    case "web":
      return { cpu: 35, mem: 55, disk: 40, load: 1.2 };
    case "app":
      return { cpu: 48, mem: 62, disk: 35, load: 1.8 };
    case "database":
      return { cpu: 42, mem: 72, disk: 58, load: 2.1 };
    case "cache":
      return { cpu: 25, mem: 68, disk: 20, load: 0.6 };
    case "worker":
      return { cpu: 55, mem: 50, disk: 30, load: 2.4 };
    default:
      return { cpu: 20, mem: 40, disk: 25, load: 0.4 };
  }
}

export const hosts: Host[] = seedHosts.map((h) => {
  const b = baseline(h.role);
  const cpu = clamp(jitter(b.cpu, 20), 5, 99);
  const memory = clamp(jitter(b.mem, 15), 10, 98);
  const disk = clamp(jitter(b.disk, 10), 5, 95);
  const load = clamp(jitter(b.load, 1), 0.1, 12);
  let status: HostStatus = "up";
  if (cpu > 90 || memory > 92) status = "degraded";
  if (cpu > 97 && memory > 95) status = "down";
  return { ...h, cpu, memory, disk, load, status, lastSeen: now() };
});

// Inject a couple of stressed hosts for demo drama
hosts[2].cpu = 91;
hosts[2].status = "degraded";
hosts[4].memory = 94;
hosts[4].status = "degraded";

export const series: Record<string, MetricPoint[]> = {};
const metrics = ["cpu_usage_percent", "memory_usage_percent", "disk_usage_percent", "http_latency_ms"];

for (const m of metrics) {
  series[m] = Array.from({ length: 24 }, (_, i) => {
    const t = new Date(Date.now() - (23 - i) * 3600_000).toISOString();
    const base =
      m === "http_latency_ms" ? 120 : m === "cpu_usage_percent" ? 40 : m === "memory_usage_percent" ? 60 : 45;
    return { ts: t, value: Math.round(clamp(jitter(base, 25), 1, m.includes("latency") ? 800 : 100) * 10) / 10 };
  });
}

export let alerts: Alert[] = [
  {
    id: randomUUID(),
    hostId: "h3",
    hostName: "api-01",
    title: "High CPU utilization",
    severity: "warning",
    status: "firing",
    metric: "cpu_usage_percent",
    value: 91,
    threshold: 85,
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: randomUUID(),
    hostId: "h5",
    hostName: "db-primary",
    title: "Memory pressure",
    severity: "critical",
    status: "firing",
    metric: "memory_usage_percent",
    value: 94,
    threshold: 90,
    createdAt: new Date(Date.now() - 28 * 60_000).toISOString(),
  },
  {
    id: randomUUID(),
    hostId: "h7",
    hostName: "cache-01",
    title: "Elevated disk usage",
    severity: "info",
    status: "acknowledged",
    metric: "disk_usage_percent",
    value: 78,
    threshold: 75,
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
];

export let incidents: Incident[] = [
  {
    id: randomUUID(),
    title: "Database memory saturation",
    severity: "critical",
    status: "investigating",
    hostName: "db-primary",
    alertId: alerts[1].id,
    createdAt: alerts[1].createdAt,
    summary: "Critical memory alert on primary DB. Replica healthy. Investigating connection spikes.",
  },
];

export const checks: ServiceCheck[] = [
  { id: "c1", name: "Public website", target: "https://app.example.com/health", status: "pass", latencyMs: 86, lastChecked: now() },
  { id: "c2", name: "API gateway", target: "https://api.example.com/health", status: "pass", latencyMs: 112, lastChecked: now() },
  { id: "c3", name: "Auth service", target: "https://auth.example.com/health", status: "pass", latencyMs: 95, lastChecked: now() },
  { id: "c4", name: "Payments webhook", target: "https://pay.example.com/health", status: "fail", latencyMs: 2400, lastChecked: now() },
];

export function tickMetrics() {
  for (const h of hosts) {
    h.cpu = clamp(jitter(h.cpu, 4), 3, 99);
    h.memory = clamp(jitter(h.memory, 2), 8, 99);
    h.disk = clamp(jitter(h.disk, 0.5), 5, 99);
    h.load = clamp(jitter(h.load, 0.3), 0.1, 15);
    h.lastSeen = now();
    if (h.cpu > 97 && h.memory > 95) h.status = "down";
    else if (h.cpu > 88 || h.memory > 90) h.status = "degraded";
    else h.status = "up";
  }
  for (const m of Object.keys(series)) {
    const last = series[m][series[m].length - 1]?.value ?? 40;
    series[m].push({ ts: now(), value: Math.round(clamp(jitter(last, 8), 1, m.includes("latency") ? 900 : 100) * 10) / 10 });
    if (series[m].length > 48) series[m].shift();
  }
  for (const c of checks) {
    c.latencyMs = Math.round(clamp(jitter(c.latencyMs, 40), 20, 3000));
    c.status = c.name.includes("Payments") && c.latencyMs > 1500 ? "fail" : "pass";
    c.lastChecked = now();
  }
}

export function overview() {
  const up = hosts.filter((h) => h.status === "up").length;
  const degraded = hosts.filter((h) => h.status === "degraded").length;
  const down = hosts.filter((h) => h.status === "down").length;
  const firing = alerts.filter((a) => a.status === "firing").length;
  const openIncidents = incidents.filter((i) => i.status !== "resolved").length;
  const avgCpu = Math.round((hosts.reduce((s, h) => s + h.cpu, 0) / hosts.length) * 10) / 10;
  const avgMem = Math.round((hosts.reduce((s, h) => s + h.memory, 0) / hosts.length) * 10) / 10;
  return {
    hostsTotal: hosts.length,
    hostsUp: up,
    hostsDegraded: degraded,
    hostsDown: down,
    alertsFiring: firing,
    openIncidents,
    avgCpu,
    avgMem,
    checksFailing: checks.filter((c) => c.status === "fail").length,
    generatedAt: now(),
  };
}
