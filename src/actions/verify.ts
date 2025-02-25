"use server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const Verify = async (formData: FormData, email: string) => {
  await dbConnect();
  try {
    const code = formData.get("code")!.toString();
    const decodedemail = decodeURIComponent(email);
    const user = await UserModel.findOne({ email: decodedemail });

    if (!user) {
      return { success: false, message: "User not found", status: 404 };
    }
    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();
      return {
        success: true,
        message: "Account verified successfully",
        status: 200,
      };
    } else if (!isCodeNotExpired) {
      // Code has expired
      return {
        success: false,
        message:
          "Verification code has expired. Please sign up again to get a new code.",
        status: 400,
      };
    } else {
      // Code is incorrect
      return {
        success: false,
        message: "Incorrect verification code",
        status: 400,
      };
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return {
      error: error,
      success: false,
      message: "Error verifying user",
      status: 500,
    };
  }
};
