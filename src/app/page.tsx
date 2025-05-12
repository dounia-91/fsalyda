"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import InstallPWAButton from "@/components/InstallPWAButton";

export default function Home() {
  const { status } = useSession();

  // Enregistrement du Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker enregistré avec succès :", registration);
        })
        .catch((error) => {
          console.log("Échec de l'enregistrement du Service Worker :", error);
        });
    }
  }, []);

  if (status === "unauthenticated") {
    return (
      <main className="w-full min-h-[calc(100vh-theme(space.20))] flex flex-col items-center max-md:p-5 max-md:py-20 md:p-20 text-white bg-gradient-to-br from-[#325777] to-[#000987] space-y-5">
        <h1 className="w-full text-center text-5xl font-bold">
          Welcome to Fsalyda
        </h1>
        <p className="w-full text-center text-xl">Please SignIn to Continue</p>
        <Link className="p-3 bg-white font-bold rounded-lg text-black" href="/signin">
          SignIn
        </Link>
        <InstallPWAButton />
      </main>
    );
  }

  return (
    <main className="w-full min-h-[calc(100vh-theme(space.20))] flex flex-col items-center max-md:p-5 max-md:py-20 p-20 text-white bg-gradient-to-br from-[#325777] to-[#000987] space-y-5">
      <h1 className="w-full text-center text-5xl font-bold">
        Welcome to Fsalyda
      </h1>
      <p className="w-full text-center text-xl">Continue to your Dashboard</p>
      <Link className="p-3 bg-white font-bold rounded-lg text-black" href="/dashboard">
        Dashboard
      </Link>
      <InstallPWAButton />
    </main>
  );
}
