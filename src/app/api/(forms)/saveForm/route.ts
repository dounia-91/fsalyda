import dbConnect from "@/lib/dbConnect";
import AdminModel, { Admin } from "@/model/admin";
import BusinessUserModel, { BusinessUser } from "@/model/businessUser";
import FormModel from "@/model/form";
import NotificationModel from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const {
    companyName,
    formName,
    formItems,
    formItemsLength,
    formItemDetails,
    usersWithAccess,
    creatorEmail,
  } = await request.json();
  try {
    const existingForm = await FormModel.findOne({
      companyName,
      title: formName,
    });

    if (!existingForm) {
      const newForm = new FormModel({
        companyName,
        title: formName,
        formItems,
        formItemsLength,
        formItemDetails,
        usersWithAccess,
      });
      await newForm.save();
      const toUsers: string[] = [];
      const admins = await AdminModel.find();
      admins.map((admin: Admin) => toUsers.push(admin.email));
      const managers = await BusinessUserModel.find({ companyName });
      managers.map((m: BusinessUser) => toUsers.push(m.email));
      usersWithAccess.map((u: string) => toUsers.push(u));
      if (toUsers.includes(creatorEmail)) {
        const index = toUsers.indexOf(creatorEmail);
        toUsers.splice(index, 1);
      }
      await Promise.all(
        toUsers.map(async (u: string) => {
          const notification = new NotificationModel({
            title: "New Form Created",
            message: `A new Form ${formName} is created by ${creatorEmail} for the company ${companyName}`,
            toUser: u,
            fromUser: creatorEmail,
          });
          await notification.save();
        })
      );
      return NextResponse.json(
        { success: true, message: "Form Saved successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Form name already exists" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error saving form :", error);
    return NextResponse.json(
      { success: false, message: "Error saving Form" },
      { status: 500 }
    );
  }
}
