const isBrowser = typeof window !== "undefined";

export const storage = {
  get: (key: string): string | null => {
    if (!isBrowser) return null;
    const value = localStorage.getItem(key);

    if (value === "undefined" || value === "null") {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  },

  set: (key: string, value: string | null | undefined): void => {
    if (!isBrowser) return;

    if (
      value === undefined ||
      value === null ||
      value === "undefined" ||
      value === "null"
    ) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, value);
  },

  remove: (key: string): void => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (!isBrowser) return;
    localStorage.clear();
  },
};
