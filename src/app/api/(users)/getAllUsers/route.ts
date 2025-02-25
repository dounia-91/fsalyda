import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import BusinessUserModel from "@/model/businessUser";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  await dbConnect();
  try {
    let businessUsers = await BusinessUserModel.find({});
    let users = await UserModel.find({});
    if (!businessUsers) {
      businessUsers = [];
    }
    if (!users) {
      users = [];
    }
    let allUsers = [...businessUsers, ...users];
    allUsers = allUsers.toSorted((a, b) =>
      a.companyName.localeCompare(b.companyName)
    );
    if (allUsers.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Users found" },
        { status: 200 }
      );
    }
    revalidatePath("/adminDashboard/users");
    return NextResponse.json(
      { success: true, message: "Users fetched successfully", users: allUsers },
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
