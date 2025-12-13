export function addToLocalStorage(key: string, value: string) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function getFromLocalStorage(key: string): string | null {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return null;
}
