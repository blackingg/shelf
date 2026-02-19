"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  ReaderThemeName,
  readerThemes,
  ReaderThemeColors,
} from "./readerThemes";

interface ReaderContextType {
  theme: ReaderThemeName;
  setTheme: (theme: ReaderThemeName) => void;
  currentTheme: ReaderThemeColors;
  fontSize: number;
  setFontSize: (size: number) => void;
  format: "pdf" | "epub";
  setFormat: (format: "pdf" | "epub") => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({
  children,
  initialFormat = "epub",
}: {
  children: ReactNode;
  initialFormat?: "pdf" | "epub";
}) {
  const [theme, setTheme] = useState<ReaderThemeName>("light");
  const [fontSize, setFontSize] = useState(18);
  const [format, setFormat] = useState<"pdf" | "epub">(initialFormat);

  useEffect(() => {
    setFormat(initialFormat);
  }, [initialFormat]);

  const currentTheme = readerThemes[theme];

  return (
    <ReaderContext.Provider
      value={{
        theme,
        setTheme,
        currentTheme,
        fontSize,
        setFontSize,
        format,
        setFormat,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error("useReader must be used within a ReaderProvider");
  }
  return context;
}
