'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    const onLoad = () => {
      if (!('serviceWorker' in navigator)) return;

      navigator.serviceWorker
        .register('/pwabuilder-sw.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré', registration);

          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.onstatechange = () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('🔄 Nouvelle version disponible');
                  // Ici tu peux déclencher une notification, un toast ou un bouton reload
                } else {
                  console.log('✅ Contenu mis en cache pour une utilisation hors-ligne');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('❌ Erreur lors de l’enregistrement du Service Worker :', error);
        });
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
