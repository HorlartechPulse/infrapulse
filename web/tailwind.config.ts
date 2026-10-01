import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        panel: "#111827",
        line: "#1f2937",
        muted: "#94a3b8",
        accent: "#22d3ee",
        warn: "#fbbf24",
        crit: "#f87171",
        ok: "#34d399",
      },
    },
  },
  plugins: [],
} satisfies Config;
