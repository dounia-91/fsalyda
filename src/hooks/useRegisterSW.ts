import { useEffect } from "react";

export default function useRegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Lors du chargement de la page
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("✅ Service Worker enregistré :", registration);

            // Vérifie si une nouvelle version du SW est disponible
            registration.onupdatefound = () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.onstatechange = () => {
                  if (newWorker.state === "installed") {
                    if (navigator.serviceWorker.controller) {
                      console.log("🔄 Nouvelle version disponible");
                      // Tu peux afficher une notification ici pour informer l'utilisateur
                    } else {
                      console.log("✅ Contenu mis en cache pour une utilisation hors-ligne");
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error("❌ Erreur lors de l'enregistrement du Service Worker :", error);
          });
      });
    }
  }, []);
}
