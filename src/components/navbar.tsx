"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoginBtn from "./loginBtn";
import logo from "@/../public/logo.png";
import { Notification } from "@/model/notification";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user.role;
  const email = session?.user.email;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const hideDrawer = () => {
    setIsDrawerOpen(false);
    document.removeEventListener("click", hideDrawer);
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(isDrawerOpen ? false : true);
    if (!isDrawerOpen) {
      document.addEventListener("click", hideDrawer);
    }
  };
  useEffect(() => {
    if (email) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.post("/api/getNotifications", { email });
          if (response.data.success) {
            let un = 0;
            response.data.notifications.map((n: Notification) => {
              if (!n.isRead) un++;
            });
            setUnreadNotifications(un);
          } else {
            setUnreadNotifications(0);
          }
        } catch (error) {
          console.log("Error fecting Notifications", error);
        }
      };
      fetchNotifications();
      // Set up a polling interval (adjust as needed)
      const intervalId = setInterval(fetchNotifications, 5000); // Fetch data every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [session, email]);

  const ulClass = isDrawerOpen
    ? "flex flex-col absolute top-20 right-0 bg-gray-300 w-[60vw] min-h-[90vh] z-[10] justify-start items-center"
    : "w-full h-full flex items-center justify-end space-x-2 hidden lg:flex";
  const liClass = isDrawerOpen
    ? "flex items-center justify-center mt-2 py-3 w-[60vw] bg-white text-lg "
    : "cursor-pointer p-2 bg-[#343666] rounded-lg text-white active:bg-white/20";

  return (
    <nav className="sticky top-0 z-10 w-full h-20 p-5 lg:p-10 flex justify-between items-center bg-slate-300 text-[#343666] shadow-2xl">
      <div className="flex h-full items-center">
        <Image
          className="w-20 h-auto"
          src={logo}
          alt="logo"
          width={2048}
          height={2048}
        />
        <span className="max-sm:text-2xl sm:text-4xl">FSALYDA</span>
      </div>
      <div className="hamburger flex items-center justify-end w-[40%]">
        <ul id="drawer" className={ulClass}>
          <li className={liClass}>
            <Link href="/">Home</Link>
          </li>
          <li className={liClass}>
            <Link href={role === "user" ? "/dashboard" : `/${role}Dashboard`}>
              Dashboard
            </Link>
          </li>
          <li className={liClass}>
            <LoginBtn />
          </li>
        </ul>
        <Link
          href={role === "user" ? "/dashboard" : `/${role}Dashboard`}
          className="relative max-lg:mr-2 lg:ml-2 p-1"
        >
          <div
            className={`absolute top-0 right-0 z-10 flex items-center justify-center bg-red-500 w-4 h-4 rounded-full text-white text-[8px] overflow-hidden ${
              unreadNotifications === 0 ? "hidden" : ""
            }`}
          >
            {unreadNotifications}
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <i className="fa-solid fa-bell max-sm:text-2xl sm:text-3xl" />
          </div>
        </Link>
        <svg
          aria-hidden="true"
          id="hamburger"
          className="lg:hidden"
          onClick={toggleDrawer}
          fill="#343666"
          version="1.1"
          xmlns="https://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <title>Toggle Menu</title>
          <path d="M3 13h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 19h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
        </svg>
      </div>
    </nav>
  );
}
