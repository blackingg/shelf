"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ePub, { Book, Location, Rendition } from "epubjs";
import { epubThemes } from "./readerThemes";
import { useReader } from "./ReaderContext";
import { useNotifications } from "@/app/context/NotificationContext";

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
}

export function EpubViewer({
  buffer,
  onReady,
  onPageDetails,
}: EpubViewerProps) {
  const {
    themeName,
    fontSize,
    setTableOfContentsItems,
    setTableOfContentsNavigator,
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
      allowScriptedContent: true,
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
        console.log(book);
        const total = book.locations.length();
        onPageDetails?.({ totalPages: total });
        return rendition.display();
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
        onPageDetails?.({
          currentPage: Number(currentLoc),
          totalPages: book.locations.length(),
        });
      }
    });

    return () => {
      setTableOfContentsNavigator(null);
      rendition.destroy();
      book.destroy();
    };
  }, [buffer, fontSize, themeName]);

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
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-neutral-500 animate-pulse">
              Loading book content...
            </p>
          </div>
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
