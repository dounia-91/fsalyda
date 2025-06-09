"use client";
import Notifications from "@/components/notification";
import { Notification } from "@/model/notification";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InstallButton from "@/components/InstallButton"; // 👈 Bouton d'installation PWA

export default function AdminDashboard() {
  const { data: session } = useSession();
  const email = session?.user.email;
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.post("/api/getNotifications", { email });
        if (response.data.success) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.log("Error fetching Notifications", error);
      }
    };
    fetchNotifications();

    // Set up polling interval
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, [session]);

  return (
    <main className="w-full h-full flex flex-col bg-background bg-auto bg-no-repeat bg-center">
      <InstallButton /> {/* 👈 Ajout du bouton flottant d'installation */}
      <div className="w-full h-full flex flex-col items-center p-10 bg-gradient-to-br from-blue-600/50 to-blue-200/50 overflow-auto space-y-5">
        <h1 className="w-full text-center text-3xl font-bold">
          Welcome to admin Dashboard
        </h1>
        <div className="w-full max-w-lg min-h-20 flex flex-col items-center bg-white/50 backdrop-blur-sm rounded-lg p-2 space-y-5">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="relative w-full flex flex-col items-center space-y-2">
            {notifications?.length === 0 ? (
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-lg">
                No Notifications Found
              </p>
            ) : (
              notifications.map((notification, i) => (
                <Notifications
                  key={i}
                  title={notification.title}
                  message={notification.message}
                  id={notification._id as string}
                  isRead={notification.isRead}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
