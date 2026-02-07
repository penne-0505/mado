import { DashboardShell } from "./components/layout/DashboardShell";
import { WidgetGrid } from "./components/layout/WidgetGrid";
import { Button } from "./components/foundation/Button";
import { WidgetCard } from "./components/widget/WidgetCard";
import { ClockWidget } from "./widgets/ClockWidget";
import { LauncherWidget } from "./widgets/LauncherWidget";
import { SearchWidget } from "./widgets/SearchWidget";

const widgetAnimationDelay = ["0ms", "80ms", "160ms", "240ms"];

export function App(): JSX.Element {
  return (
    <DashboardShell>
      <WidgetGrid>
        <WidgetCard
          title="Clock"
          description="JST clock foundation widget"
          status="ready"
          className="md:col-span-1"
          style={{ animationDelay: widgetAnimationDelay[0] }}
        >
          <ClockWidget />
        </WidgetCard>

        <WidgetCard
          title="Search"
          description="Reusable search input and action"
          status="ready"
          className="md:col-span-1"
          style={{ animationDelay: widgetAnimationDelay[1] }}
        >
          <SearchWidget />
        </WidgetCard>

        <WidgetCard
          title="Quick Launcher"
          description="Widget card structure for grouped links"
          status="loading"
          className="md:col-span-2 xl:col-span-1"
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

        <WidgetCard
          title="Weather"
          description="State slot for upcoming API widget"
          status="error"
          className="md:col-span-2 xl:col-span-3"
          style={{ animationDelay: widgetAnimationDelay[3] }}
        >
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/25 bg-black/10 px-6 py-12 text-center text-sm text-ink/75">
            Functions integration (General-Feat-8) will plug into this card without changing layout primitives.
          </div>
        </WidgetCard>
      </WidgetGrid>
    </DashboardShell>
  );
}
