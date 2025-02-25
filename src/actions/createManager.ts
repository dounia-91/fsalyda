"use server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import AdminModel, { Admin } from "@/model/admin";
import BusinessUserModel from "@/model/businessUser";
import NotificationModel from "@/model/notification";

export const CreateManager = async (
  formData: FormData,
  creatorEmail: string
) => {
  await dbConnect();
  try {
    const companyName = formData.get("companyName")!.toString().toLowerCase();
    const fullName = formData.get("fullName")!.toString();
    const email = formData.get("email")!.toString().toLowerCase();
    const password = formData.get("password")!.toString();
    const maxUsers = parseInt(formData.get("maxUsers")!.toString());
    const existingManager = await BusinessUserModel.findOne({ companyName });
    if (existingManager) {
      return {
        success: false,
        message: `Company account already exists for ${companyName}.`,
        status: 200,
      };
    }
    const existingManagerbyEmail = await BusinessUserModel.findOne({ email });
    if (existingManagerbyEmail) {
      return {
        success: false,
        message: `Company account already exists with this email ${email}.`,
        status: 200,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new BusinessUserModel({
      companyName,
      name: fullName,
      email,
      password: hashedPassword,
      maxUsers,
      isVerified: true,
      role: "manager",
    });
    await newUser.save();
    const toUsers: string[] = [];
    const admins = await AdminModel.find();
    admins.map((a: Admin) => toUsers.push(a.email));
    if (toUsers.includes(creatorEmail)) {
      const index = toUsers.indexOf(creatorEmail);
      toUsers.splice(index, 1);
    }
    await Promise.all(
      toUsers.map(async (u) => {
        const notification = new NotificationModel({
          title: "New Form Submission",
          message: `A new Company account ${email} is created by ${creatorEmail}, for the company ${companyName}`,
          toUser: u,
          fromUser: creatorEmail,
        });
        await notification.save();
      })
    );
    return {
      success: true,
      message: "Company account created successfully.",
      status: 200,
    };
  } catch (e) {
    console.error("Error creating company account:", e);
    return {
      error: e,
      success: false,
      message: "Error creating company account. Please try again.",
      status: 500,
    };
  }
};
