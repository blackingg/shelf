export interface ShareOptions {
  title?: string;
  text?: string;
  url: string;
}

/**
 * Shared utility to trigger the native browser share manifest.
 * Since this is a PWA application, we rely on navigator.share availability.
 */
export const shareContent = async (
  options: ShareOptions,
): Promise<"shared" | "copied" | false> => {
  if (typeof window !== "undefined" && navigator.share) {
    try {
      await navigator.share(options);
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error sharing content:", err);
      }
      return false;
    }
  }

  if (typeof window !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(options.url);
      return "copied";
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      return false;
    }
  }

  return false;
};
