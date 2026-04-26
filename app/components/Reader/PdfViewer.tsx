"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { parsePdf, getPdfPage } from "./processingFunctions";
import { renderPdfPage } from "./pdfRenderer";
import { useReader } from "./ReaderContext";
import type { PdfDocument } from "./processingFunctions";

export interface PdfViewerHandle {
  scrollToPage: (page: number) => void;
}

interface PdfViewerProps {
  buffer: ArrayBuffer;
  onPageInfo?: (info: { currentPage: number; totalPages: number }) => void;
}

/**
 * Continuous-scroll PDF viewer with lazy-loaded canvas pages.
 * Uses IntersectionObserver to render pages on demand and track the current page.
 */
export const PdfViewer = forwardRef<PdfViewerHandle, PdfViewerProps>(
  function PdfViewer({ buffer, onPageInfo }, ref) {
    const { pdfScale, setTableOfContentsItems, setTableOfContentsNavigator } =
      useReader();
    const containerRef = useRef<HTMLDivElement>(null);
    const [doc, setDoc] = useState<PdfDocument | null>(null);
    const [pageDimensions, setPageDimensions] = useState<
      { width: number; height: number }[]
    >([]);

    // Keep latest callback in a ref so observers/listeners never go stale
    const onPageInfoRef = useRef(onPageInfo);
    onPageInfoRef.current = onPageInfo;

    // Track which pages have been rendered
    const renderedPages = useRef<Set<number>>(new Set());
    const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
    const pageElementRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    // Scroll to a specific page
    const scrollToPage = useCallback((pageNum: number) => {
      const el = pageElementRefs.current.get(pageNum);
      if (el && containerRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, []);

    // Expose scrollToPage to parent
    useImperativeHandle(ref, () => ({ scrollToPage }), [scrollToPage]);

    // Parse PDF on mount
    useEffect(() => {
      parsePdf(buffer).then(async (parsed) => {
        setDoc(parsed);
        onPageInfoRef.current?.({
          currentPage: 1,
          totalPages: parsed.numPages,
        });

        // Pre-compute page dimensions at scale 1 for placeholder sizing
        const dims: { width: number; height: number }[] = [];
        for (let i = 1; i <= parsed.numPages; i++) {
          const page = await parsed.pdf.getPage(i);
          const vp = page.getViewport({ scale: 1 });
          dims.push({ width: vp.width, height: vp.height });
        }
        setPageDimensions(dims);

        // Extract Table of Contents (outline) if available
        try {
          const outline = await parsed.pdf.getOutline();
          if (outline && outline.length > 0) {
            const flattenOutline = (
              items: any[],
              level: number,
            ): { label: string; href: string; level: number }[] => {
              const result: { label: string; href: string; level: number }[] =
                [];
              for (const item of items) {
                result.push({
                  label: item.title,
                  href: JSON.stringify(item.dest),
                  level,
                });
                if (item.items?.length) {
                  result.push(...flattenOutline(item.items, level + 1));
                }
              }
              return result;
            };
            setTableOfContentsItems(flattenOutline(outline, 0));
          }
        } catch {
          // No outline available
        }
      });
    }, [buffer, setTableOfContentsItems]);

    // Table of Contents navigate handler — resolve destination to page and scroll
    useEffect(() => {
      if (!doc) return;
      setTableOfContentsNavigator((href: string) => {
        try {
          const dest = JSON.parse(href);
          if (typeof dest === "string") {
            // Named destination
            doc.pdf.getDestination(dest).then((resolved) => {
              if (!resolved) return;
              doc.pdf.getPageIndex(resolved[0]).then((pageIndex) => {
                scrollToPage(pageIndex + 1);
              });
            });
          } else if (Array.isArray(dest)) {
            doc.pdf.getPageIndex(dest[0]).then((pageIndex) => {
              scrollToPage(pageIndex + 1);
            });
          }
        } catch {
          // Invalid href
        }
      });
      return () => setTableOfContentsNavigator(null);
    }, [doc, setTableOfContentsNavigator, scrollToPage]);

    // Render a single page to its canvas
    const renderPage = useCallback(
      async (pageNum: number) => {
        if (!doc || renderedPages.current.has(pageNum)) return;
        const canvas = canvasRefs.current.get(pageNum);
        if (!canvas) return;

        renderedPages.current.add(pageNum);
        try {
          const pdfPage = await getPdfPage(doc.pdf, pageNum);
          await renderPdfPage(pdfPage, canvas, pdfScale);
        } catch {
          renderedPages.current.delete(pageNum);
        }
      },
      [doc, pdfScale],
    );

    // Re-render all visible pages when scale changes
    useEffect(() => {
      if (!doc) return;
      // Clear rendered cache to force re-render at new scale
      renderedPages.current.clear();

      canvasRefs.current.forEach((_, pageNum) => {
        renderPage(pageNum);
      });
    }, [pdfScale, doc, renderPage]);

    // Lazy loading observer — render pages as they approach the viewport
    useEffect(() => {
      if (!doc || pageDimensions.length === 0) return;

      const lazyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const pageNum = Number(
                (entry.target as HTMLElement).dataset.page,
              );
              if (pageNum) renderPage(pageNum);
            }
          });
        },
        {
          root: containerRef.current,
          rootMargin: "200% 0px",
        },
      );

      // Current page tracking observer
      const trackingObserver = new IntersectionObserver(
        (entries) => {
          let mostVisiblePage = 0;
          let maxRatio = 0;
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              mostVisiblePage = Number(
                (entry.target as HTMLElement).dataset.page,
              );
            }
          });
          if (mostVisiblePage > 0) {
            onPageInfoRef.current?.({
              currentPage: mostVisiblePage,
              totalPages: doc.numPages,
            });
          }
        },
        {
          root: containerRef.current,
          threshold: 0.5,
        },
      );

      pageElementRefs.current.forEach((el) => {
        lazyObserver.observe(el);
        trackingObserver.observe(el);
      });

      return () => {
        lazyObserver.disconnect();
        trackingObserver.disconnect();
      };
    }, [doc, pageDimensions, renderPage]);

    if (!doc || pageDimensions.length === 0) {
      return <p className="text-center py-12 opacity-60">Loading PDF…</p>;
    }

    return (
      <div
        ref={containerRef}
        className="w-full overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{ height: "100%" }}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          {pageDimensions.map((dim, i) => {
            const pageNum = i + 1;
            return (
              <div
                key={pageNum}
                data-page={pageNum}
                ref={(el) => {
                  if (el) pageElementRefs.current.set(pageNum, el);
                }}
                className="relative bg-white shadow-lg"
                style={{
                  width: dim.width * pdfScale,
                  height: dim.height * pdfScale,
                  maxWidth: "100%",
                }}
              >
                <canvas
                  ref={(el) => {
                    if (el) canvasRefs.current.set(pageNum, el);
                  }}
                  className="w-full h-full"
                  style={{ display: "block" }}
                />
                {/* Page separator label */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider text-gray-400 bg-gray-100 border border-gray-200">
                  {pageNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
