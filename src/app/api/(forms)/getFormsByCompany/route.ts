import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/form";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const companyNamePn = searchParams.get("companyName");
  const companyName = companyNamePn?.slice(0, -2);
  const pn = companyNamePn?.slice(-2);
  try {
    const forms = await FormModel.find({ companyName });
    if (!forms || forms.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Forms found" },
        { status: 200 }
      );
    }
    if (pn === "ud") {
      revalidatePath("/dashboard");
    } else if (pn === "md") {
      revalidatePath("/managerDashboard");
    }
    return NextResponse.json(
      { success: true, message: "Forms fetched successfully", forms: forms },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching Forms:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Forms" },
      { status: 500 }
    );
  }
}
