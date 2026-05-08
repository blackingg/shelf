"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  ReaderThemeName,
  readerThemes,
  ReaderThemeColors,
} from "./readerThemes";
import { usePersistentReaderSettings } from "@/app/hooks/usePersistentReaderSettings";
import { useProgressActions } from "@/app/services";
import { useAppSelector } from "@/app/store/store";
import { selectIsAuthenticated } from "@/app/store/authSlice";

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

  // Progress
  currentPage: number;
  totalPages: number;
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
  isInitialLoad: boolean;
  setIsInitialLoad: (loading: boolean) => void;
  updateProgress: (current: number, total: number) => void;
  initialPage?: number;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({
  children,
  initialFormat,
  bookId,
  initialPage,
}: {
  children: ReactNode;
  initialFormat?: "pdf" | "epub";
  bookId?: string;
  initialPage?: number;
}) {
  const { theme, setTheme, fontSize, setFontSize, pdfScale, setPdfScale } =
    usePersistentReaderSettings();

  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false);
  const [tableOfContentsItems, setTableOfContentsItems] = useState<
    TableOfContentsItem[]
  >([]);
  const [onTableOfContentsNavigate, _setOnTableOfContentsNavigate] = useState<
    ((href: string) => void) | null
  >(null);

  const [currentPage, setCurrentPage] = useState(initialPage ?? 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  const updateProgress = useCallback((current: number, total: number) => {
    setCurrentPage(current);
    setTotalPages(total);
  }, []);

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
    currentPage,
    totalPages,
    isReady,
    setIsReady,
    isInitialLoad,
    setIsInitialLoad,
    updateProgress,
    initialPage,
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
      {bookId && (
        <ReaderProgressSyncer
          bookId={bookId}
          initialPage={initialPage}
        />
      )}
    </ReaderContext.Provider>
  );
}

function ReaderProgressSyncer({
  bookId,
  initialPage,
}: {
  bookId: string;
  initialPage?: number;
}) {
  const { currentPage, totalPages, isReady, isInitialLoad } = useReader();
  const { actions: progressActions } = useProgressActions();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const lastSyncedPage = useRef(initialPage ?? 0);

  useEffect(() => {
    // Only sync if the reader is ready (rendering done), initial load/jump is finished, and it's a NEW page
    if (
      isReady &&
      !isInitialLoad &&
      isAuthenticated &&
      bookId &&
      currentPage > 0 &&
      currentPage !== lastSyncedPage.current
    ) {
      // Set this immediately to avoid re-triggering if the component re-renders
      // before the timeout executes.
      lastSyncedPage.current = currentPage;

      // Debounce the actual API call to prevent race conditions (500 Internal Error)
      // when a user rapidly turns multiple pages and hits the backend concurrently.
      const timer = setTimeout(() => {
        progressActions
          .updateProgress({
            bookId,
            currentPage: currentPage,
            totalPages: totalPages,
          })
          .catch((err) => {
            // If it fails, allow retry on next change by resetting the ref
            console.error("Failed to sync progress:", err);
            lastSyncedPage.current = 0;
          });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    currentPage,
    bookId,
    totalPages,
    isReady,
    isInitialLoad,
    progressActions,
    isAuthenticated,
  ]);

  return null;
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error("useReader must be used within a ReaderProvider");
  }
  return context;
}
