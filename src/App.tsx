import { DashboardShell } from "./components/layout/DashboardShell";
import { WidgetGrid } from "./components/layout/WidgetGrid";
import { Button } from "./components/foundation/Button";
import { WidgetCard } from "./components/widget/WidgetCard";
import { ClockWidget } from "./widgets/ClockWidget";
import { LauncherWidget } from "./widgets/LauncherWidget";
import { SearchWidget } from "./widgets/SearchWidget";
import type { ResponsiveLayouts } from "react-grid-layout";

const widgetAnimationDelay = ["0ms", "80ms", "160ms", "240ms"];

const defaultWidgetLayouts: ResponsiveLayouts = {
  xl: [
    { i: "clock", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "search", x: 1, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "launcher", x: 2, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "weather", x: 0, y: 2, w: 3, h: 2, minW: 1, minH: 2 },
  ],
  md: [
    { i: "clock", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "search", x: 1, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "launcher", x: 0, y: 2, w: 2, h: 2, minW: 1, minH: 2 },
    { i: "weather", x: 0, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
  ],
  sm: [
    { i: "clock", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "search", x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "launcher", x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
    { i: "weather", x: 0, y: 6, w: 1, h: 2, minW: 1, minH: 2 },
  ],
};

export function App(): JSX.Element {
  const widgetItems = [
    {
      id: "clock",
      content: (
        <WidgetCard
          title="Clock"
          description="JST clock foundation widget"
          status="ready"
          style={{ animationDelay: widgetAnimationDelay[0] }}
        >
          <ClockWidget />
        </WidgetCard>
      ),
    },
    {
      id: "search",
      content: (
        <WidgetCard
          title="Search"
          description="Reusable search input and action"
          status="ready"
          style={{ animationDelay: widgetAnimationDelay[1] }}
        >
          <SearchWidget />
        </WidgetCard>
      ),
    },
    {
      id: "launcher",
      content: (
        <WidgetCard
          title="Quick Launcher"
          description="Widget card structure for grouped links"
          status="loading"
          style={{ animationDelay: widgetAnimationDelay[2] }}
          actions={
            <>
              <Button tone="ghost" type="button">
                Edit
              </Button>
              <Button tone="ghost" type="button">
                Reorder
              </Button>
            </>
          }
        >
          <LauncherWidget />
        </WidgetCard>
      ),
    },
    {
      id: "weather",
      content: (
        <WidgetCard
          title="Weather"
          description="State slot for upcoming API widget"
          status="error"
          style={{ animationDelay: widgetAnimationDelay[3] }}
        >
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/25 bg-black/10 px-6 py-12 text-center text-sm text-ink/75">
            Functions integration (General-Feat-8) will plug into this card without changing layout primitives.
          </div>
        </WidgetCard>
      ),
    },
  ];

  return (
    <DashboardShell>
      <WidgetGrid items={widgetItems} defaultLayouts={defaultWidgetLayouts} />
    </DashboardShell>
  );
}
