type StorageType = "local" | "session";

const isBrowser = typeof window !== "undefined";

export const storage = {
  get: (key: string, type: StorageType = "local"): string | null => {
    if (!isBrowser) return null;
    return type === "local"
      ? localStorage.getItem(key)
      : sessionStorage.getItem(key);
  },

  set: (key: string, value: string, type: StorageType = "local"): void => {
    if (!isBrowser) return;
    if (type === "local") {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  },

  remove: (key: string, type: StorageType = "local"): void => {
    if (!isBrowser) return;
    if (type === "local") {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  },

  clear: (type: StorageType = "local"): void => {
    if (!isBrowser) return;
    if (type === "local") {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }
  },

  // Helper to find key in either storage, preferring local
  find: (key: string): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  },

  // Helper to remove key from both
  removeFromBoth: (key: string): void => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};
