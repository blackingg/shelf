"use client";
import React, { useRef, useEffect, useState } from "react";
import Epub, { Book, Location, Rendition } from "epubjs";
import { epubThemes } from "./readerThemes";
import { useReader } from "./ReaderContext";
import { useNotifications } from "@/app/context/NotificationContext";

interface EpubViewerProps {
  buffer?: ArrayBuffer;
  onReady?: (controls: {
    next: () => void;
    prev: () => void;
    goTo?: (page: number) => void;
  }) => void;
  onPageDetails?: (info: { currentPage?: number; totalPages?: number }) => void;
}

const generateLocations = async (book: Book) => {
  await book.ready;
  await book.locations.generate(1024);
};

export function EpubViewer({
  buffer,
  onReady,
  onPageDetails,
}: EpubViewerProps) {
  const {
    theme,
    fontSize,
    loading,
    setLoading,
    epubTotalPages,
    setEpubTotalPages,
    setEpubCurrentPage,
  } = useReader();
  const viewRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<Book | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!buffer || buffer.byteLength === 0) return;
    const book = Epub(buffer);
    bookRef.current = book;
    if (!viewRef.current) return;

    const rendition = book.renderTo(viewRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
    });
    renditionRef.current = rendition;

    rendition.themes.register("light", epubThemes.light);
    rendition.themes.register("dark", epubThemes.dark);
    rendition.themes.register("sepia", epubThemes.sepia);
    rendition.themes.select(theme);
    rendition.themes.fontSize(`${fontSize}px`);

    Promise.all([generateLocations(book), book.ready])
      .then(() => {
        setEpubTotalPages(book.locations.length());
        return rendition.display();
      })
      .then(() => {
        onReady?.({
          next: () => {
            rendition.next();
          },
          prev: () => rendition.prev(),
          goTo: (p) => {
            const cfi = book.locations.cfiFromLocation(p);
            rendition.display(cfi);
          },
        });
        onPageDetails?.({
          totalPages: book.locations.length(),
        });
      })
      .finally(() => {
        addNotification("success", "Book contents loaded sucessfully");
        alert("Book contents loaded successfully");
        setLoading(false);
      });

    rendition.on("relocated", (location: Location) => {
      const current_page = book.locations.locationFromCfi(location.start.cfi);

      onPageDetails?.({
        currentPage: Number(current_page),
        totalPages: book.locations.length(),
      });
    });

    return () => {
      renditionRef.current?.destroy();
      book?.destroy();
    };
  }, [buffer]);

  useEffect(() => {
    renditionRef.current?.themes.select(theme);
  }, [theme]);

  useEffect(() => {
    const getPercentageLocation = async () => {
      const location = await renditionRef.current?.location.start.percentage;
      if (!location) return;
      setEpubCurrentPage(Math.round(location * epubTotalPages));
    };

    getPercentageLocation();
  }, [renditionRef.current?.location]);

  useEffect(() => {
    renditionRef.current?.themes.fontSize(`${fontSize}px`);
  }, [fontSize]);

  return (
    <>
      <p className={`${loading ? "text-4xl text-black" : "hidden"}`}>
        Loading...
      </p>
      <div
        ref={viewRef}
        style={{
          height: "80vh",
          width: "100%",
          maxWidth: "80vw",
          display: !loading ? "block" : "none",
          overflowX: "hidden",
        }}
      />
    </>
  );
}

/*const rendition = renditionRef.current;
    const book = bookRef.current;
    if (!rendition || !book) return;

    const currentLocation = rendition.currentLocation();
    if (!currentLocation) return;

    const currentCfi = currentLocation.cfi;
    console.log(currentCfi); */
