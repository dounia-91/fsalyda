import dbConnect from "@/lib/dbConnect";
import NotificationModel from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { title, message, from } = await req.json();
    const notification = new NotificationModel({ title, message, from });
    await notification.save();
    return NextResponse.json(
      { success: true, message: "Notification created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error creating Notification", error);
    return NextResponse.json(
      { success: false, message: "Error creating Notification" },
      { status: 500 }
    );
  }
}
