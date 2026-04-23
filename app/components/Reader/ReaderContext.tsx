"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  ReaderThemeName,
  readerThemes,
  ReaderThemeColors,
} from "./readerThemes";
import { usePersistentReaderSettings } from "@/app/hooks/usePersistentReaderSettings";

/** Represents a chapter or section in a book's Table of Contents */
export interface TableOfContentsItem {
  label: string;
  /** A format-specific reference (e.g. CFI for EPUB, Page index for PDF) */
  href: string;
  /** Hierarchy level (0 for top-level, 1 for sub-chapter, etc) */
  level: number;
}

interface ReaderContextType {
  // Appearance
  currentTheme: ReaderThemeColors;
  themeName: ReaderThemeName;
  setTheme: (theme: ReaderThemeName) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  pdfScale: number;
  setPdfScale: (scale: number) => void;

  // Format
  format: "pdf" | "epub" | null;

  // Table of Contents
  isTableOfContentsOpen: boolean;
  setIsTableOfContentsOpen: (open: boolean) => void;
  tableOfContentsItems: TableOfContentsItem[];
  setTableOfContentsItems: (items: TableOfContentsItem[]) => void;
  /** Triggered when a user clicks a TOC item. Navigator implementation depends on the viewer. */
  onTableOfContentsNavigate: ((href: string) => void) | null;
  setTableOfContentsNavigator: (fn: ((href: string) => void) | null) => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({
  children,
  initialFormat,
}: {
  children: ReactNode;
  initialFormat?: "pdf" | "epub";
}) {
  const { theme, setTheme, fontSize, setFontSize, pdfScale, setPdfScale } =
    usePersistentReaderSettings();

  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false);
  const [tableOfContentsItems, setTableOfContentsItems] = useState<TableOfContentsItem[]>([]);
  const [onTableOfContentsNavigate, _setOnTableOfContentsNavigate] = useState<
    ((href: string) => void) | null
  >(null);

  /**
   * Sets the navigation handler for the current viewer.
   * Wrapped in a function setter to avoid React treating the handler function itself as an initializer.
   */
  const setTableOfContentsNavigator = useCallback(
    (fn: ((href: string) => void) | null) => {
      _setOnTableOfContentsNavigate(() => fn);
    },
    [],
  );

  const currentThemeData = readerThemes[theme];

  const value: ReaderContextType = {
    currentTheme: currentThemeData,
    themeName: theme,
    setTheme,
    fontSize,
    setFontSize,
    pdfScale,
    setPdfScale,
    format: initialFormat || null,
    isTableOfContentsOpen,
    setIsTableOfContentsOpen,
    tableOfContentsItems,
    setTableOfContentsItems,
    onTableOfContentsNavigate,
    setTableOfContentsNavigator,
  };

  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error("useReader must be used within a ReaderProvider");
  }
  return context;
}
