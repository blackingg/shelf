export type ReaderThemeName = "light" | "sepia" | "dark";

export interface ReaderThemeColors {
  bg: string;
  text: string;
  ui: string;
  accent: string;
  panel: string;
}

export const readerThemes: Record<ReaderThemeName, ReaderThemeColors> = {
  light: {
    bg: "bg-white",
    text: "text-gray-900",
    ui: "bg-white border-gray-200",
    accent: "text-emerald-700",
    panel: "bg-gray-50 border-gray-200",
  },
  sepia: {
    bg: "bg-[#f4ecd8]",
    text: "text-[#5b4636]",
    ui: "bg-[#f4ecd8] border-[#e3d7bf]",
    accent: "text-[#8c6b5d]",
    panel: "bg-[#ebe0c8] border-[#dccfb4]",
  },
  dark: {
    bg: "bg-[#1a1a1a]",
    text: "text-[#d1d5db]",
    ui: "bg-[#262626] border-[#404040]",
    accent: "text-emerald-400",
    panel: "bg-[#262626] border-[#404040]",
  },
};

/** EPUB-compatible theme objects for epubjs rendition.themes.register() */
export const epubThemes = {
  light: {
    body: {
      background: "#ffffff",
      color: "#000000",
    },
  },
  dark: {
    body: {
      background: "#1a1a1a",
      color: "#eaeaea",
    },
  },
  sepia: {
    body: {
      background: "#f4ecd8",
      color: "#5b4636",
    },
  },
};
