import dbConnect from "@/lib/dbConnect";
import NotificationModel, { Notification } from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Missing required field: email" },
        { status: 400 }
      );
    }
    const notifications = await NotificationModel.find({ toUser: email })
      .sort({ createdAt: -1 })
      .limit(50);
    if (!notifications || notifications.length === 0) {
      return NextResponse.json(
        { success: true, message: "No Notifications found", notifications: [] },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Notifications fetched successfully",
        notifications,
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
