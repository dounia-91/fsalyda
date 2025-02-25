"use server";
import dbConnect from "@/lib/dbConnect";
import BusinessUserModel, { BusinessUser } from "@/model/businessUser";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/user";
import AdminModel, { Admin } from "@/model/admin";
import NotificationModel from "@/model/notification";

export const Signup = async (formData: FormData) => {
  await dbConnect();
  try {
    const companyName = formData.get("companyName")!.toString().toLowerCase();
    const fullName = formData.get("fullName")!.toString();
    const email = formData.get("email")!.toString().toLowerCase();
    const password = formData.get("password")!.toString();
    const existingManager = await BusinessUserModel.findOne({ companyName });
    if (!existingManager) {
      return {
        success: false,
        message: "Invalid Company Name.",
        status: 200,
      };
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 3600000);

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
      existingUser.verifyCode = verifyCode;
      existingUser.verifyCodeExpiry = expiryDate;
      await existingUser.save();
    } else {
      const maxUsers = existingManager.maxUsers;
      const existingUsers = await UserModel.find({ companyName });
      if (existingUsers && existingUsers.length >= maxUsers) {
        return {
          success: false,
          message: `Maximum user limit for the company ${companyName} has been exhausted.`,
          status: 200,
        };
      }
      const newUser = new UserModel({
        companyName,
        name: fullName,
        email,
        password: hashedPassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        role: "user",
      });
      await newUser.save();
    }
    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      companyName,
      fullName,
      verifyCode
    );
    if (!emailResponse.success) {
      return {
        success: false,
        message: emailResponse.message,
        status: 500,
      };
    }
    const toUsers: string[] = [];
    const admins = await AdminModel.find();
    admins.map((a: Admin) => toUsers.push(a.email));
    const managers = await BusinessUserModel.find({ companyName });
    managers.map((m: BusinessUser) => toUsers.push(m.email));
    if (toUsers.includes(email)) {
      const index = toUsers.indexOf(email);
      toUsers.splice(index, 1);
    }
    await Promise.all(
      toUsers.map(async (u) => {
        const notification = new NotificationModel({
          title: "New Form Submission",
          message: `A new User ${email} has registerd an account, for the company ${companyName}.`,
          toUser: u,
          fromUser: email,
        });
        await notification.save();
      })
    );
    return {
      success: true,
      message: "User registered successfully. Please verify your account.",
      status: 200,
    };
  } catch (e) {
    console.error("Error registering user:", e);
    return {
      error: e,
      success: false,
      message: "Error registering User. Please try again.",
      status: 500,
    };
  }
};
