# InfraPulse — IT Infrastructure Monitoring & Observability

**Tagline:** Monitor everything. Respond faster.

Web-based **infrastructure monitoring and observability** platform with a dashboard UI, Express REST API, and simulated telemetry for portfolio demonstration.

| | |
|--|--|
| **GitHub** | *Add repository link* |
| **Live Demo** | *Add application demo link* |

> Telemetry is **simulated** so the full pipeline runs offline. Not a replacement for Prometheus/Grafana in production.

---

## Technologies

| Layer | Stack |
|--------|--------|
| Dashboard | **React / Next.js 14**, TypeScript, Tailwind, Recharts |
| Backend | **Node.js**, **Express.js**, REST `/api/v1` |
| Data | In-memory inventory + metric series (demo) |

---

## Key areas

1. **Dashboard interface development** — Overview KPIs, charts, host table, alert console, incidents  
2. **Backend service integration** — Next.js client calls versioned REST endpoints  
3. **Infrastructure data presentation** — Hosts, CPU/memory/disk, alerts, synthetic checks  

---

## Structure

```
infrapulse/
├── backend/     Express API (hosts, metrics, alerts, incidents, checks)
├── web/         Next.js operations dashboard
└── README.md
```

---

## Features

| Area | Detail |
|------|--------|
| Overview | KPIs, CPU series chart, firing alerts, host snapshot |
| Hosts | Inventory with role, env, region, utilization |
| Alerts | Firing / acknowledged / resolved + acknowledge action |
| Incidents | Correlated issue cards |
| Checks | Synthetic health probes with latency |
| Theme | Dark ops console, cyan accent, server photography |

---

## Quick start

```bash
# API
cd backend
npm install
npm run dev          # :4900

# Dashboard
cd ../web
cp .env.example .env.local
npm install
npm run dev          # :3000
```

Open **http://localhost:3000**

## Deploy the API to Render

The root `render.yaml` configures the backend service with `backend` as its root
directory, runs `npm install && npm run build` during deployment, and starts it
with `npm start`. Create or update the Render service from this Blueprint so the
TypeScript build runs before the service starts. For a manually configured
service, use the same root directory, build command, and start command.

---

## API

| Method | Path |
|--------|------|
| GET | `/api/v1/health` |
| GET | `/api/v1/overview` |
| GET | `/api/v1/hosts` · `/hosts/:id` |
| GET | `/api/v1/metrics/series?metric=cpu_usage_percent` |
| GET | `/api/v1/alerts` |
| POST | `/api/v1/alerts/:id/ack` |
| GET | `/api/v1/incidents` |
| GET | `/api/v1/checks` |

---

## Author

**Abdulwaheed Toheeb Olanrewaju**  
Portfolio — Observability / Full-Stack Dashboard Engineering
