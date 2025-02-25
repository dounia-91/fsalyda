import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { emailValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/user";
import BusinessUserModel from "@/model/businessUser";
import AdminModel from "@/model/admin";

const EmailQuerySchema = z.object({
  email: emailValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      email: searchParams.get("email"),
    };
    const result = EmailQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const emailErrors = result.error.format().email?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            emailErrors?.length > 0 ? emailErrors.join(", ") : "Invalid email",
        },
        { status: 200 }
      );
    }

    const { email } = result.data;
    let existingVerifiedUser = await UserModel.findOne({
      email,
      isVerified: true,
    });
    if (!existingVerifiedUser) {
      existingVerifiedUser = await BusinessUserModel.findOne({
        email,
        isVerified: true,
      });
      if (!existingVerifiedUser) {
        existingVerifiedUser = await AdminModel.findOne({
          email,
          isVerified: true,
        });
        if (!existingVerifiedUser) {
          return Response.json(
            {
              success: true,
              message: "Email is unique",
            },
            { status: 200 }
          );
        }
      }
    }
    return Response.json(
      {
        success: false,
        message: "Email is already taken",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking Email:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking Email",
      },
      { status: 500 }
    );
  }
}
