import { Router } from "express";
import {
  alerts,
  checks,
  hosts,
  incidents,
  overview,
  series,
  tickMetrics,
} from "../data/store.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "infrapulse" } });
});

router.get("/overview", (_req, res) => {
  tickMetrics();
  res.json({ success: true, data: overview() });
});

router.get("/hosts", (_req, res) => {
  res.json({ success: true, data: hosts });
});

router.get("/hosts/:id", (req, res) => {
  const h = hosts.find((x) => x.id === req.params.id);
  if (!h) return res.status(404).json({ success: false, message: "Host not found" });
  res.json({ success: true, data: h });
});

router.get("/metrics/series", (req, res) => {
  const metric = String(req.query.metric || "cpu_usage_percent");
  const data = series[metric] || [];
  res.json({ success: true, data: { metric, points: data } });
});

router.get("/alerts", (req, res) => {
  const status = req.query.status ? String(req.query.status) : null;
  let data = alerts;
  if (status) data = alerts.filter((a) => a.status === status);
  res.json({ success: true, data });
});

router.post("/alerts/:id/ack", (req, res) => {
  const a = alerts.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: "Alert not found" });
  a.status = "acknowledged";
  a.acknowledgedAt = new Date().toISOString();
  res.json({ success: true, data: a });
});

router.get("/incidents", (_req, res) => {
  res.json({ success: true, data: incidents });
});

router.get("/checks", (_req, res) => {
  res.json({ success: true, data: checks });
});

export default router;
