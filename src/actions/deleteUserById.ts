"use server";
import dbConnect from "@/lib/dbConnect";
import BusinessUserModel from "@/model/businessUser";
import UserModel from "@/model/user";
import mongoose from "mongoose";

export const DeleteUser = async (id: string) => {
  await dbConnect();
  try {
    let user = await UserModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!user) {
      user = await BusinessUserModel.findById({
        _id: new mongoose.Types.ObjectId(id),
      });
      if (!user) {
        return { success: false, message: "User not found", status: 200 };
      }
    }
    await user.deleteOne();
    return { success: true, message: "User deleted successfully", status: 200 };
  } catch (error) {
    console.log("Error deleting User:", error);
    return {
      error: error,
      success: false,
      message: "Error deleting User",
      status: 500,
    };
  }
};
