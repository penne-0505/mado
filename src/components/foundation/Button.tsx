import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "ghost";
};

export function Button({ className, tone = "primary", ...props }: ButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition",
        tone === "primary"
          ? "bg-accent/90 text-white hover:bg-accent focus-visible:ring-accent/50"
          : "border border-white/20 bg-white/10 text-ink hover:bg-white/15 focus-visible:ring-white/30",
        "focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
