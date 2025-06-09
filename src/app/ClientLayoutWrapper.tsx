"use client";

import { ReactNode, useEffect } from "react";
import Navbar from "@/components/navbar";
import AuthProvider from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRegisterSW from "@/hooks/useRegisterSW";

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  useRegisterSW();

  return (
    <AuthProvider>
      <Navbar />
      {children}
      <ToastContainer />
    </AuthProvider>
  );
}
