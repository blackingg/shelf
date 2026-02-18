import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    // Check if user has dismissed the prompt recently (within 14 days)
    const checkDismissed = () => {
      const dismissedTimestamp = localStorage.getItem("pwa_prompt_dismissed");
      if (dismissedTimestamp) {
        const daysSinceDismissal =
          (Date.now() - parseInt(dismissedTimestamp, 10)) /
          (1000 * 60 * 60 * 24);
        if (daysSinceDismissal < 14) {
          setIsDismissed(true);
        } else {
          localStorage.removeItem("pwa_prompt_dismissed");
        }
      }
    };

    // Check if device is iOS
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);
    };

    checkStandalone();
    checkDismissed();
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as any,
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as any,
      );
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const dismissPrompt = () => {
    setIsDismissed(true);
    localStorage.setItem("pwa_prompt_dismissed", Date.now().toString());
  };

  return {
    canInstall: !!deferredPrompt,
    isStandalone,
    isDismissed,
    isIOS,
    promptInstall,
    dismissPrompt,
  };
}
