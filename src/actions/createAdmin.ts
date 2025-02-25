"use server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import AdminModel, { Admin } from "@/model/admin";
import NotificationModel from "@/model/notification";

export const CreateAdmin = async (formData: FormData, creatorEmail: string) => {
  await dbConnect();
  try {
    const companyName = "fsalyda";
    const fullName = formData.get("fullName")!.toString();
    const email = formData.get("email")!.toString().toLowerCase();
    const password = formData.get("password")!.toString();
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "Admin account already exists with this email.",
        status: 200,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    const newUser = new AdminModel({
      companyName,
      name: fullName,
      email,
      password: hashedPassword,
      verifyCode: "000000",
      isVerified: true,
      verifyCodeExpiry: expiryDate,
      role: "admin",
    });
    await newUser.save();
    const toUsers: string[] = [];
    const admins = await AdminModel.find();
    admins.map((a: Admin) => toUsers.push(a.email));
    if (toUsers.includes(creatorEmail)) {
      const index = toUsers.indexOf(creatorEmail);
      toUsers.splice(index, 1);
    }
    if (toUsers.includes(email)) {
      const index = toUsers.indexOf(email);
      toUsers.splice(index, 1);
    }
    await Promise.all(
      toUsers.map(async (u) => {
        const notification = new NotificationModel({
          title: "New Form Submission",
          message: `A new Admin account ${email} is created by ${creatorEmail}.`,
          toUser: u,
          fromUser: creatorEmail,
        });
        await notification.save();
      })
    );
    return {
      success: true,
      message: "Admin account created successfully.",
      status: 200,
    };
  } catch (e) {
    console.error("Error creating Admin account:", e);
    return {
      error: e,
      success: false,
      message: "Error creating Admin account. Please try again.",
      status: 500,
    };
  }
};
