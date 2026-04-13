import { useState, useEffect } from "react";
import { watchResponsiveGridFetchLimit } from "@/app/helpers/responsive";

type GridColumnsByBreakpoint = {
  base: number;
  md?: number;
  lg?: number;
  xl?: number;
};

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
