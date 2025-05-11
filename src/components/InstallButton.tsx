"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && "prompt" in deferredPrompt) {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        console.log("✅ L'installation a été acceptée");
      } else {
        console.log("❌ L'installation a été refusée");
      }
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300"
      title="Installer Fsalyda"
    >
      <i className="fa-solid fa-download text-xl" />
    </button>
  );
}
