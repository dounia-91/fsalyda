import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get("companyName");
  try {
    const users = await UserModel.find({ companyName });
    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Users found" },
        { status: 200 }
      );
    }
    revalidatePath("/managerDashboard/users");
    return NextResponse.json(
      { success: true, message: "Users fetched successfully", users: users },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching Users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Users" },
      { status: 500 }
    );
  }
}
