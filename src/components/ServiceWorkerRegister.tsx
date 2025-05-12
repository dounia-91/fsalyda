'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/pwabuilder-sw.js')
          .then((reg) => console.log('✅ Service Worker enregistré', reg))
          .catch((err) => console.error('❌ Erreur SW', err));
      });
    }
  }, []);

  return null;
}
