type GridColumnsByBreakpoint = {
  base: number;
  md?: number;
  lg?: number;
  xl?: number;
};

export const getResponsiveGridColumns = (
  width: number,
  columns: GridColumnsByBreakpoint,
) => {
  if (width >= 1280 && columns.xl) return columns.xl;
  if (width >= 1024 && columns.lg) return columns.lg;
  if (width >= 768 && columns.md) return columns.md;
  return columns.base;
};

export const getResponsiveGridFetchLimit = (
  width: number,
  columns: GridColumnsByBreakpoint,
  rows = 1,
) => {
  return getResponsiveGridColumns(width, columns) * rows;
};

export const watchResponsiveGridFetchLimit = (
  columns: GridColumnsByBreakpoint,
  onChange: (limit: number) => void,
  rows = 1,
) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const update = () => {
    onChange(getResponsiveGridFetchLimit(window.innerWidth, columns, rows));
  };

  update();
  window.addEventListener("resize", update);

  return () => {
    window.removeEventListener("resize", update);
  };
};
