import type { ReactNode } from "react";

type WidgetGridProps = {
  children: ReactNode;
};

export function WidgetGrid({ children }: WidgetGridProps): JSX.Element {
  return <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</section>;
}
