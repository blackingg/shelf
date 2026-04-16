export interface ShareOptions {
  title?: string;
  text?: string;
  url: string;
}

/**
 * Shared utility to trigger the native browser share manifest.
 * Since this is a PWA application, we rely on navigator.share availability.
 */
export const shareContent = async (options: ShareOptions): Promise<boolean> => {
  if (typeof window !== "undefined" && navigator.share) {
    try {
      await navigator.share(options);
      return true;
    } catch (err) {
      // AbortError is normal when user cancels the share sheet
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error sharing content:", err);
      }
      return false;
    }
  }
  
  return false;
};
