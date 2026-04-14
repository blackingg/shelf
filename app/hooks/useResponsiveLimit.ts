import { useState, useEffect } from "react";
import { watchResponsiveGridFetchLimit } from "@/app/helpers/responsive";

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
 * @param columns - An object defining the number of columns for different breakpoints (base, md, lg, xl).
 * @param rows - The number of rows to calculate the limit for. Defaults to 1.
 * @param initialLimit - The initial limit used before responsive calculation. Defaults to 10.
 * @returns The calculated limit (columns * rows).
 */
export function useResponsiveLimit(
  columns: GridColumnsByBreakpoint,
  rows: number = 1,
  initialLimit: number = 10
) {
  const [limit, setLimit] = useState(initialLimit);

  useEffect(() => {
    const stopWatch = watchResponsiveGridFetchLimit(columns, setLimit, rows);
    return () => stopWatch();
  }, [JSON.stringify(columns), rows]);

  return limit;
}
