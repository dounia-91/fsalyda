import dbConnect from "@/lib/dbConnect";
import NotificationModel from "@/model/notification";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { id } = await req.json();
    const notification = await NotificationModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 200 }
      );
    }
    notification.isRead = true;
    await notification.save();
    return NextResponse.json(
      { success: true, message: "Notification status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating notification status", error);
    return NextResponse.json(
      { success: false, message: "Error updating notification status" },
      { status: 500 }
    );
  }
}
