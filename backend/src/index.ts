import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import api from "./routes/api.js";

const app = express();
const PORT = Number(process.env.PORT) || 4900;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", api);
app.use((_req, res) => res.status(404).json({ success: false, message: "Not found" }));

app.listen(PORT, () => {
  console.log(`
  📡 InfraPulse API
  ➜ http://localhost:${PORT}/api/v1
  ➜ GET /api/v1/overview
  `);
});
