"use client";
import Sidebar from "@/components/sidebar/sidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <main className="relative w-full h-[calc(100vh-theme(space.20))] flex">
      <div
        className={`max-sm:absolute max-sm:top-0 max-sm:left-0 max-sm:z-10 h-full transform ${
          isSidebarOpen ? "w-60" : "max-sm:w-0 sm:w-16"
        }`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div
        className={`relative max-sm:w-[100%] h-full overflow-hidden transform ${
          isSidebarOpen
            ? "sm:w-[calc(100%-theme(space.60))]"
            : "sm:w-[calc(100%-theme(space.16))]"
        }`}
      >
        <span
          className={`${
            isSidebarOpen && "hidden"
          } absolute top-2 left-2 z-50 w-10 sm:hidden h-10 self-end flex items-center justify-center rounded-full border border-2 border-white`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i
            className={`fa-solid fa-arrow-left text-white text-2xl transform ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
          />
        </span>
        {children}
      </div>
    </main>
  );
}
