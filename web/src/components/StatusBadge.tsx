import clsx from "clsx";

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === "up" || status === "pass" || status === "resolved"
      ? "bg-ok/15 text-ok"
      : status === "degraded" || status === "warning" || status === "acknowledged" || status === "investigating"
        ? "bg-warn/15 text-warn"
        : status === "down" || status === "critical" || status === "firing" || status === "fail"
          ? "bg-crit/15 text-crit"
          : "bg-white/10 text-muted";
  return (
    <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase", color)}>
      {status}
    </span>
  );
}
