import { cn } from "../../lib/cn";

type WidgetStateTone = "ready" | "loading" | "error";

const toneStyles: Record<WidgetStateTone, string> = {
  ready: "bg-emerald-500/20 text-emerald-100 border-emerald-300/30",
  loading: "bg-amber-400/25 text-amber-100 border-amber-200/40",
  error: "bg-rose-500/20 text-rose-100 border-rose-300/35",
};

const toneLabels: Record<WidgetStateTone, string> = {
  ready: "READY",
  loading: "LOADING",
  error: "ERROR",
};

type WidgetStateProps = {
  tone: WidgetStateTone;
};

export function WidgetState({ tone }: WidgetStateProps): JSX.Element {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em]",
        toneStyles[tone],
      )}
    >
      {toneLabels[tone]}
    </span>
  );
}
