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
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 200 }
      );
    }
    const toDisUsers: string[] = [];
    existingForm.usersWithAccess.map((e: string) => {
      if (!usersWithAccess.includes(e)) toDisUsers.push(e);
    });
    await Promise.all(
      toDisUsers.map(async (u: string) => {
        const disNotif = new NotificationModel({
          title: "Form Access revoked",
          message: `Your access to the form ${formName} is revoked by ${creatorEmail}`,
          toUser: u,
          fromUser: creatorEmail,
        });
        await disNotif.save();
      })
    );
    existingForm.title = formName;
    existingForm.formItems = formItems;
    existingForm.formItemsLength = formItemsLength;
    existingForm.formItemDetails = formItemDetails;
    existingForm.usersWithAccess = usersWithAccess;
    await existingForm.save();
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
          title: "Form Modified",
          message: `A Form ${formName} is modified by ${creatorEmail} for the company ${companyName}`,
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
  } catch (error) {
    console.log("Error saving form :", error);
    return NextResponse.json(
      { success: false, message: "Error saving Form" },
      { status: 500 }
    );
  }
}
