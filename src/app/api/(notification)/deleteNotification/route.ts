import dbConnect from "@/lib/dbConnect";
import NotificationModel from "@/model/notification";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { id } = await req.json();
    const notification = NotificationModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 200 }
      );
    }
    console.log(notification);
    await notification.deleteOne();
    return NextResponse.json(
      { success: true, message: "Notification deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting Notification", error);
    return NextResponse.json(
      { success: false, message: "Error deleting Notification" },
      { status: 500 }
    );
  }
}
