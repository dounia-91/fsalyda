import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
};

export default function Notifications({ id, title, message, isRead }: Props) {
  const handleRead = async () => {
    try {
      const response = await axios.post(`/api/markNotificationRead`, { id });
      if (response.data.success) {
        toast(response.data.message, { type: "success" });
      } else {
        toast(response.data.message, { type: "error" });
      }
    } catch (error) {
      console.log("Error updating notification status", error);
      toast("Error updating notification status", { type: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`/api/deleteNotification`, { id });
      if (response.data.success) {
        toast(response.data.message, { type: "success" });
      } else {
        toast(response.data.message, { type: "error" });
      }
    } catch (error) {
      console.log("Error deleting Notification", error);
      toast("Error deleting Notification", { type: "error" });
    }
  };

  return (
    <div
      className={`w-full flex flex-col items-start justify-start p-2 ${
        isRead ? "bg-gray-100" : "bg-amber-100"
      } rounded-lg`}
    >
      <h2 className="w-full max-sm:text-md text-lg font-bold">{title}</h2>
      <div className="w-full flex items-center justify-between">
        <p className="w-[60%]">{message}</p>
        <div className="w-[40%] flex items-center justify-center space-x-2">
          <button
            className="p-2 rounded-lg bg-black text-white text-sm disabled:bg-gray-200"
            onClick={handleRead}
            disabled={isRead}
          >
            Mark as Read
          </button>
          <button
            className="p-2 rounded-lg bg-black text-white text-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
