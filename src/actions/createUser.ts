"use server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user";
import AdminModel, { Admin } from "@/model/admin";
import BusinessUserModel, { BusinessUser } from "@/model/businessUser";
import NotificationModel from "@/model/notification";

export const CreateUser = async (formData: FormData, creatorEmail: string) => {
  await dbConnect();
  try {
    const companyName = formData.get("companyName")!.toString().toLowerCase();
    const fullName = formData.get("fullName")!.toString();
    const email = formData.get("email")!.toString().toLowerCase();
    const password = formData.get("password")!.toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return {
          success: false,
          message: "User account already exists with this email.",
          status: 200,
        };
      }
      existingUser.name = fullName;
      existingUser.companyName = companyName;
      existingUser.password = hashedPassword;
      existingUser.verifyCode = "000000";
      existingUser.verifyCodeExpiry = expiryDate;
      existingUser.isVerified = true;
      await existingUser.save();
    } else {
      const existingManager = await BusinessUserModel.findOne({ companyName });
      const maxUsers = existingManager!.maxUsers;
      const existingUsers = await UserModel.find({ companyName });
      if (existingUsers && existingUsers.length >= maxUsers) {
        return {
          success: false,
          message: `Maximum account limit for the company ${companyName} is ${maxUsers}.`,
          status: 200,
        };
      }
      const newUser = new UserModel({
        companyName,
        name: fullName,
        email,
        password: hashedPassword,
        verifyCode: "000000",
        isVerified: true,
        verifyCodeExpiry: expiryDate,
        role: "user",
      });
      await newUser.save();
    }
    const toUsers: string[] = [];
    const admins = await AdminModel.find();
    admins.map((a: Admin) => toUsers.push(a.email));
    const managers = await BusinessUserModel.find({ companyName });
    managers.map((m: BusinessUser) => toUsers.push(m.email));
    if (toUsers.includes(creatorEmail)) {
      const index = toUsers.indexOf(creatorEmail);
      toUsers.splice(index, 1);
    }
    await Promise.all(
      toUsers.map(async (u) => {
        const notification = new NotificationModel({
          title: "New Form Submission",
          message: `A new User ${email} is created by ${creatorEmail}, for the company ${companyName}`,
          toUser: u,
          fromUser: creatorEmail,
        });
        await notification.save();
      })
    );
    return {
      success: true,
      message: "User created successfully.",
      status: 200,
    };
  } catch (e) {
    console.error("Error creating user:", e);
    return {
      error: e,
      success: false,
      message: "Error creating User. Please try again.",
      status: 500,
    };
  }
};
