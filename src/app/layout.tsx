import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "@/components/navbar";
import AuthProvider from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FSALYDA",
    template: "%s - FSALYDA",
  },
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <head>
  <link
    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    rel="stylesheet"
  />
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#2a2a2a" />
  <link rel="icon" href="/icon-192.png" />
</head>
      <AuthProvider>
        <body className={`${inter.className} antialiased`}>
          <Navbar />
          {children}
          <ToastContainer />
        </body>
      </AuthProvider>
    </html>
  );
}
