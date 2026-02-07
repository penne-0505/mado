import { useEffect, useState } from "react";

function formatClock(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).format(date);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export function ClockWidget(): JSX.Element {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-white/10 bg-black/10 p-4">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-ink/55">Tokyo Time</p>
      <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">{formatClock(now)}</p>
      <p className="mt-1 text-sm text-ink/70">{formatDate(now)}</p>
    </div>
  );
}
