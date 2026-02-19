"use client";
import React, { useRef, useEffect } from "react";
import Epub, { Rendition } from "epubjs";
import { epubThemes } from "./readerThemes";
import { useReader } from "./ReaderContext";

interface EpubViewerProps {
  buffer: ArrayBuffer;
  onReady?: (controls: {
    next: () => void;
    prev: () => void;
    goTo?: (page: number) => void;
  }) => void;
}

export function EpubViewer({ buffer, onReady }: EpubViewerProps) {
  const { theme, fontSize } = useReader();
  const viewRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);

  useEffect(() => {
    if (!buffer || buffer.byteLength === 0) return;

    const book = Epub(buffer);
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

    book.ready.then(() => {
      rendition.display();
      onReady?.({
        next: () => rendition.next(),
        prev: () => rendition.prev(),
        goTo: (p) => rendition.display(p),
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
    renditionRef.current?.themes.fontSize(`${fontSize}px`);
  }, [fontSize]);

  return (
    <div
      ref={viewRef}
      style={{
        height: "72.5vh",
        width: "100%",
        maxWidth: "80vw",
        overflowX: "hidden",
      }}
    />
  );
}
