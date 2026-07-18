"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ePub, { Book, Location, Rendition } from "epubjs";
import { epubThemes } from "./readerThemes";
import { useReader } from "./ReaderContext";
import { useNotifications } from "@/app/context/NotificationContext";
import { SpinnerLoader } from "../Loader/SpinnerLoader";

export async function generateLocations(book: Book) {
  await book.ready;
  return await book.locations.generate(1024);
}

interface EpubViewerProps {
  buffer: ArrayBuffer;
  onReady?: (controls: {
    next: () => void;
    prev: () => void;
    goTo?: (page: number) => void;
  }) => void;
  onPageDetails?: (info: { currentPage?: number; totalPages?: number }) => void;
  initialPage?: number;
}

export function EpubViewer({
  buffer,
  onReady,
  onPageDetails,
  initialPage,
}: EpubViewerProps) {
  const {
    themeName,
    fontSize,
    setTableOfContentsItems,
    setTableOfContentsNavigator,
    updateProgress,
    setIsReady,
  } = useReader();

  const [loading, setLoading] = useState(true);

  const viewRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<Book | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!buffer || buffer.byteLength === 0) return;

    const book = ePub(buffer);
    bookRef.current = book;

    if (!viewRef.current) return;

    const rendition = book.renderTo(viewRef.current, {
      width: "100%",
      height: "100%",
      // EPUBs are arbitrary user-uploaded HTML/JS. Do NOT allow scripts to run
      // inside the render iframe — it would be a stored-content execution vector.
      allowScriptedContent: false,
      flow: "scrolled",
      manager: "continuous",
    });
    renditionRef.current = rendition;

    // Register themes
    rendition.themes.register("light", epubThemes.light);
    rendition.themes.register("dark", epubThemes.dark);
    rendition.themes.register("sepia", epubThemes.sepia);
    rendition.themes.select(themeName);
    rendition.themes.fontSize(`${fontSize}px`);

    // Parse book structure
    Promise.all([book.ready, generateLocations(book)])
      .then(() => {
        const total = book.locations.length();
        updateProgress(initialPage ?? 1, total);
        onPageDetails?.({ totalPages: total });

        const initialLocation = initialPage
          ? book.locations.cfiFromLocation(initialPage)
          : undefined;
        return rendition.display(initialLocation);
      })
      .then(() => {
        // Parse Table of Contents
        const toc = book.navigation.toc;
        if (toc && toc.length > 0) {
          const flattenTableOfContents = (items: any[], level: number = 0) => {
            let result: any[] = [];
            items.forEach((item) => {
              result.push({
                label: item.label?.trim() ?? "Untitled",
                href: item.href,
                level,
              });
              if (item.subitems && item.subitems.length > 0) {
                result = result.concat(
                  flattenTableOfContents(item.subitems, level + 1),
                );
              }
            });
            return result;
          };
          setTableOfContentsItems(flattenTableOfContents(toc, 0));
        }

        // Provide controls to parent
        onReady?.({
          next: () => {
            if (viewRef.current) {
              viewRef.current.scrollBy({
                top: viewRef.current.clientHeight * 0.9,
                behavior: "smooth",
              });
              rendition.next();
            }
          },
          prev: () => {
            if (viewRef.current) {
              viewRef.current.scrollBy({
                top: -(viewRef.current.clientHeight * 0.9),
                behavior: "smooth",
              });
              rendition.prev();
            }
          },
          goTo: (p: number) => {
            const cfi = book.locations.cfiFromLocation(p);
            rendition.display(cfi);
          },
        });
      })
      .finally(() => {
        setLoading(false);
        setIsReady(true);
        addNotification("success", "Book contents loaded successfully");
      });

    // Set up Table of Contents navigation
    setTableOfContentsNavigator((href: string) => {
      rendition.display(href);
    });

    // Handle progress tracking
    rendition.on("relocated", (location: Location) => {
      if (book.locations.length() > 0) {
        const currentLoc = book.locations.locationFromCfi(location.start.cfi);
        const cp = Number(currentLoc);
        const tp = book.locations.length();
        updateProgress(cp, tp);
        onPageDetails?.({
          currentPage: cp,
          totalPages: tp,
        });
      }
    });

    return () => {
      setTableOfContentsNavigator(null);
      rendition.destroy();
      book.destroy();
    };
    // Only re-initialize when the book buffer changes. Font size and theme are
    // applied incrementally by the dedicated effects below — including them here
    // would destroy and rebuild the whole rendition on every tweak, losing
    // scroll position and re-firing the "loaded" toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buffer]);

  // Update theme when changed in context
  useEffect(() => {
    renditionRef.current?.themes.select(themeName);
  }, [themeName]);

  // Update font size when changed in context
  useEffect(() => {
    renditionRef.current?.themes.fontSize(`${fontSize}px`);
  }, [fontSize]);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 z-10 transition-opacity duration-500">
          <SpinnerLoader />
        </div>
      )}

      <div
        ref={viewRef}
        className="w-full overflow-y-auto custom-scrollbar"
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "80vw",
          display: !loading ? "block" : "none",
          overflowX: "hidden",
          textAlign: "justify",
        }}
      />
    </div>
  );
}
