import type { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps): JSX.Element {
  const now = new Date();
  const today = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">mado dashboard</p>
          <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Every glance,<br className="hidden sm:block" /> everything aligned.
          </h1>
        </div>
        <div className="glass-panel inline-flex rounded-2xl px-4 py-2 text-sm font-medium text-ink/80">
          {today}
        </div>
      </header>
      {children}
    </main>
  );
}
