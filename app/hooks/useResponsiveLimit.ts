import { useState, useEffect } from "react";
import {
  getResponsiveGridFetchLimit,
  watchResponsiveGridFetchLimit,
} from "@/app/helpers/responsive";

type GridColumnsByBreakpoint = {
  base: number;
  md?: number;
  lg?: number;
  xl?: number;
};

/**
 * A hook that dynamically calculates and updates the number of items to fetch
 * based on responsive grid breakpoints and the desired number of rows.
 *
 * The initial value is computed synchronously from `window.innerWidth` so that
 * the very first render already uses the correct limit. This prevents query-key
 * instability (two different limits → two separate cache entries → double fetch).
 *
 * @param columns - Number of columns per breakpoint (base, md, lg, xl).
 * @param rows - Number of rows to display. Defaults to 1.
 * @param ssrFallback - Limit used during SSR when `window` is unavailable. Defaults to 10.
 * @returns The calculated limit (columns × rows), updated on resize.
 */
export function useResponsiveLimit(
  columns: GridColumnsByBreakpoint,
  rows: number = 1,
  ssrFallback: number = 10,
) {
  const [limit, setLimit] = useState(() => {
    // Compute the correct value on the very first client render so the query
    // key is stable from the start — no effect-driven second render needed.
    if (typeof window === "undefined") return ssrFallback;
    return getResponsiveGridFetchLimit(window.innerWidth, columns, rows);
  });

  useEffect(() => {
    // Keep the value in sync when the user resizes the browser.
    const stopWatch = watchResponsiveGridFetchLimit(columns, setLimit, rows);
    return () => stopWatch();
  }, [JSON.stringify(columns), rows]);

  return limit;
}
