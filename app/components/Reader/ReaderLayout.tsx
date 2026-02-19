"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ReaderHeader } from "./ReaderHeader";
import { ReaderFooter } from "./ReaderFooter";
import { ReaderThemeName, readerThemes } from "./readerThemes";

interface ReaderLayoutProps {
  /** Title shown in the header */
  title: string;
  /** Subtitle shown below the title (e.g. author name) */
  subtitle?: string;
  /** Prefix shown before the title in lighter text (e.g. "Reviewing:") */
  titlePrefix?: string;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when user navigates to the next page */
  onNextPage: () => void;
  /** Called when user navigates to the previous page */
  onPrevPage: () => void;
  /** The main content to render in the reader area */
  children: React.ReactNode;
  /** Extra action buttons rendered in the header (e.g. moderator review panel toggle) */
  extraHeaderActions?: React.ReactNode;
  /** Extra side panels or overlays rendered alongside the content area */
  extraPanels?: React.ReactNode;
  /** Whether the content area should shrink for a side panel (e.g. moderator review panel) */
  contentShrink?: boolean;
}

export function ReaderLayout({
  title,
  subtitle,
  titlePrefix,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  children,
  extraHeaderActions,
  extraPanels,
  contentShrink = false,
}: ReaderLayoutProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<ReaderThemeName>("light");
  const [showControls, setShowControls] = useState(true);

  const currentTheme = readerThemes[theme];

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        onNextPage();
      } else if (e.key === "ArrowLeft") {
        onPrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextPage, onPrevPage]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${currentTheme.bg}`}
    >
      <ReaderHeader
        title={title}
        subtitle={subtitle}
        titlePrefix={titlePrefix}
        theme={theme}
        currentTheme={currentTheme}
        fontSize={fontSize}
        showControls={showControls}
        isFullScreen={isFullScreen}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
        onToggleFullScreen={toggleFullScreen}
        extraActions={extraHeaderActions}
      />

      <div className="flex flex-1 relative">
        <main
          className={`flex-1 w-full mx-auto px-6 py-24 md:py-32 cursor-text transition-all duration-300 ${contentShrink ? "md:pr-[320px]" : ""}`}
          onClick={() => setShowControls(!showControls)}
        >
          <div className="max-w-3xl mx-auto">{children}</div>
        </main>

        {extraPanels}
      </div>

      <ReaderFooter
        currentPage={currentPage}
        totalPages={totalPages}
        showControls={showControls}
        currentTheme={currentTheme}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </div>
  );
}
