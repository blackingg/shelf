import { storage } from "./storage";

export function addToLocalStorage(key: string, value: string) {
  storage.set(key, value);
}

export function getFromLocalStorage(key: string): string | null {
  return storage.get(key);
}
