import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { WidgetState } from "./WidgetState";

type WidgetStatus = "ready" | "loading" | "error";

type WidgetCardProps = {
  title: string;
  description: string;
  status?: WidgetStatus;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function WidgetCard({
  title,
  description,
  status = "ready",
  actions,
  children,
  className,
  style,
}: WidgetCardProps): JSX.Element {
  return (
    <article
      className={cn(
        "group glass-panel flex min-h-64 flex-col gap-5 rounded-panel p-5 shadow-glow",
        "animate-rise-fade",
        className,
      )}
      style={style}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm text-ink/70">{description}</p>
        </div>
        <WidgetState tone={status} />
      </header>

      <div className="flex-1">{children}</div>

      {actions ? <footer className="flex items-center gap-2">{actions}</footer> : null}
    </article>
  );
}
