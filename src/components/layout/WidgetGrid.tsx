import type { ReactNode } from "react";
import { useCallback, useMemo, useState, type MutableRefObject } from "react";
import {
  Responsive,
  useContainerWidth,
  type Layout,
  type LayoutItem,
  type ResponsiveLayouts,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const STORAGE_KEY = "mado.dashboard.layouts.v1";
const BREAKPOINTS = { xl: 1280, md: 768, sm: 0 };
const COLUMNS = { xl: 3, md: 2, sm: 1 };

type WidgetGridItem = {
  id: string;
  content: ReactNode;
};

type WidgetGridProps = {
  items: WidgetGridItem[];
  defaultLayouts: ResponsiveLayouts;
  storageKey?: string;
};

function isLayoutEntry(value: unknown): value is LayoutItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LayoutItem>;
  return (
    typeof candidate.i === "string" &&
    typeof candidate.x === "number" &&
    typeof candidate.y === "number" &&
    typeof candidate.w === "number" &&
    typeof candidate.h === "number"
  );
}

function clampLayoutSize(entry: LayoutItem, fallback: LayoutItem, columnCount: number): LayoutItem {
  const minW = fallback.minW ?? 1;
  const maxW = Math.min(fallback.maxW ?? columnCount, columnCount);
  const minH = fallback.minH ?? 1;
  const maxH = fallback.maxH;

  const width = Math.max(minW, Math.min(entry.w, maxW));
  const height = Math.max(minH, maxH ? Math.min(entry.h, maxH) : entry.h);
  const maxX = Math.max(0, columnCount - width);

  return {
    ...fallback,
    x: Math.max(0, Math.min(entry.x, maxX)),
    y: Math.max(0, entry.y),
    w: width,
    h: height,
  };
}

function normalizeLayouts(defaultLayouts: ResponsiveLayouts, maybeLayouts?: ResponsiveLayouts): ResponsiveLayouts {
  const normalized: ResponsiveLayouts = {};

  for (const breakpoint of Object.keys(defaultLayouts)) {
    const fallbackEntries = defaultLayouts[breakpoint] ?? [];
    const incomingEntries = (maybeLayouts?.[breakpoint] ?? []).filter(isLayoutEntry);
    const incomingMap = new Map(incomingEntries.map((entry) => [entry.i, entry]));
    const columnCount = COLUMNS[breakpoint as keyof typeof COLUMNS] ?? 1;

    normalized[breakpoint] = fallbackEntries.map((fallback) => {
      const incoming = incomingMap.get(fallback.i);
      if (!incoming) {
        return { ...fallback };
      }

      return clampLayoutSize(incoming, fallback, columnCount);
    });
  }

  return normalized;
}

function loadLayoutsFromStorage(storageKey: string, defaultLayouts: ResponsiveLayouts): ResponsiveLayouts {
  if (typeof window === "undefined") {
    return normalizeLayouts(defaultLayouts);
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return normalizeLayouts(defaultLayouts);
    }

    const parsed = JSON.parse(stored) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return normalizeLayouts(defaultLayouts);
    }

    return normalizeLayouts(defaultLayouts, parsed as ResponsiveLayouts);
  } catch {
    return normalizeLayouts(defaultLayouts);
  }
}

function persistLayouts(storageKey: string, layouts: ResponsiveLayouts): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(layouts));
  } catch {}
}

export function WidgetGrid({ items, defaultLayouts, storageKey = STORAGE_KEY }: WidgetGridProps): JSX.Element {
  const stableDefaults = useMemo(() => normalizeLayouts(defaultLayouts), [defaultLayouts]);
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(() => loadLayoutsFromStorage(storageKey, stableDefaults));
  const { width, containerRef } = useContainerWidth({ initialWidth: 1280 });
  const handleContainerRef = useCallback(
    (node: HTMLDivElement | null): void => {
      (containerRef as MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [containerRef],
  );

  function handleLayoutChange(_current: Layout, nextLayouts: ResponsiveLayouts): void {
    const normalized = normalizeLayouts(stableDefaults, nextLayouts);
    setLayouts(normalized);
    persistLayouts(storageKey, normalized);
  }

  return (
    <div className="widget-grid-shell" ref={handleContainerRef}>
      <Responsive
        width={width}
        className="widget-grid-layout"
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLUMNS}
        rowHeight={120}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        dragConfig={{ handle: ".widget-card-drag-handle" }}
        resizeConfig={{ handles: ["se"] }}
        onLayoutChange={handleLayoutChange}
      >
        {items.map((item) => (
          <div key={item.id} className="widget-grid-item">
            {item.content}
          </div>
        ))}
      </Responsive>
    </div>
  );
}
