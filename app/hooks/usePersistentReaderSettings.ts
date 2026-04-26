"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEYS = {
  theme: "shelf-reader-theme",
  fontSize: "shelf-reader-font-size",
  pdfScale: "shelf-reader-pdf-scale",
} as const;

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — silently ignore
  }
}

export type ReaderThemeName = "light" | "sepia" | "dark";

interface PersistentReaderSettings {
  theme: ReaderThemeName;
  setTheme: (t: ReaderThemeName) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  pdfScale: number;
  setPdfScale: (s: number) => void;
}

export function usePersistentReaderSettings(defaults?: {
  theme?: ReaderThemeName;
  fontSize?: number;
  pdfScale?: number;
}): PersistentReaderSettings {
  const [theme, _setTheme] = useState<ReaderThemeName>(() =>
    readFromStorage<ReaderThemeName>(
      STORAGE_KEYS.theme,
      defaults?.theme ?? "light",
    ),
  );
  const [fontSize, _setFontSize] = useState<number>(() =>
    readFromStorage<number>(STORAGE_KEYS.fontSize, defaults?.fontSize ?? 18),
  );
  const [pdfScale, _setPdfScale] = useState<number>(() =>
    readFromStorage<number>(STORAGE_KEYS.pdfScale, defaults?.pdfScale ?? 1.2),
  );

  const setTheme = useCallback((t: ReaderThemeName) => {
    _setTheme(t);
    writeToStorage(STORAGE_KEYS.theme, t);
  }, []);

  const setFontSize = useCallback((s: number) => {
    _setFontSize(s);
    writeToStorage(STORAGE_KEYS.fontSize, s);
  }, []);

  const setPdfScale = useCallback((s: number) => {
    _setPdfScale(s);
    writeToStorage(STORAGE_KEYS.pdfScale, s);
  }, []);

  return { theme, setTheme, fontSize, setFontSize, pdfScale, setPdfScale };
}
