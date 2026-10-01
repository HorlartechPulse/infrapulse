# InfraPulse architecture

```
Simulated hosts/metrics  →  Express REST API  →  Next.js dashboard
```

- `backend/src/data/store.ts` holds inventory, series, alerts, incidents, checks
- `tickMetrics()` applies jitter on each overview request for a live feel
- Dashboard polls every ~8s on the overview page
