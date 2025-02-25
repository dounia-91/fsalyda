import dbConnect from "@/lib/dbConnect";
import NotificationModel, { Notification } from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email } = await request.json();
    const notifications = await NotificationModel.find({});
    if (!notifications || notifications.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Notifications found" },
        { status: 200 }
      );
    }
    const notif: Notification[] = [];
    notifications.map((n: Notification) => {
      if (n.toUser === email) notif.push(n);
    });
    return NextResponse.json(
      {
        success: true,
        message: "Notifications fetched successfully",
        notifications: notif,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching Notifications", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Notifications" },
      { status: 500 }
    );
  }
}
