'use client';

import { useEffect, useState } from 'react';

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('L\'événement beforeinstallprompt a été déclenché dans InstallPWAButton.');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || navigator.getInstalledRelatedApps) {
        console.log('L\'application est déjà installée (InstallPWAButton).');
        setIsInstalled(true);
        setIsVisible(false); // Ne pas afficher le bouton si déjà installé
      }
    };

    checkInstalled();

    window.addEventListener('appinstalled', () => {
      console.log('L\'application PWA a été installée (InstallPWAButton).');
      setIsInstalled(true);
      setIsVisible(false); // Masquer le bouton après l'installation
      setDeferredPrompt(null); // Nettoyer deferredPrompt
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log("Installation acceptée (InstallPWAButton)");
        } else {
          console.log("Installation refusée (InstallPWAButton)");
        }
        setDeferredPrompt(null);
        setIsVisible(false);
      });
    }
  };

  if (isInstalled || !isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg z-50"
    >
      Installer Fsalyda
    </button>
  );
}
