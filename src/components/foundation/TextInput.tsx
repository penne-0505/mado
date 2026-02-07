import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, ...props }: TextInputProps): JSX.Element {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-ink placeholder:text-ink/50",
        "outline-none transition focus:border-accent/70 focus:bg-white/15 focus:ring-2 focus:ring-accent/30",
        className,
      )}
      {...props}
    />
  );
}
