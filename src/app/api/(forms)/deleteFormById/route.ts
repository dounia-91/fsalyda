import dbConnect from "@/lib/dbConnect";
import { deleteFileFromS3 } from "@/lib/s3config";
import FilledFormModel from "@/model/filledForm";
import FormModel from "@/model/form";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const form = await FormModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!form) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 200 }
      );
    }
    for (const itemD of form.formItemDetails) {
      if (itemD.title === "Image") {
        const photoArr = itemD.imageFileURLs!;
        for (let i = 0; i < photoArr.length; i++) {
          const url = photoArr[i].split("/");
          const key = `uploads/${url[url.length - 1]}`;
          await deleteFileFromS3(key);
        }
      }
    }
    const records = await FilledFormModel.find({ title: form.title });
    for (const record of records) {
      for (const itemD of record.formItemDetails) {
        if (itemD.title === "Photo") {
          const photoArr = record.formState[itemD.newTitle] as Array<string>;
          for (let i = 0; i < photoArr.length; i++) {
            const url = photoArr[i].split("/");
            const key = `uploads/${url[url.length - 1]}`;
            await deleteFileFromS3(key);
          }
        }
        if (itemD.title === "Attached file") {
          const attachArr = record.formState[itemD.newTitle] as Array<string>;
          for (let i = 0; i < attachArr.length; i++) {
            const url = attachArr[i].split("/");
            const key = `uploads/${url[url.length - 1]}`;
            await deleteFileFromS3(key);
          }
        }
        if (itemD.title === "Voice Recorder") {
          const url = (record.formState[itemD.newTitle] as string).split("/");
          const key = `uploads/${url[url.length - 1]}`;
          await deleteFileFromS3(key);
        }
      }
      await record.deleteOne();
    }
    await form.deleteOne();
    return NextResponse.json(
      { success: true, message: "Form deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting Form:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting Form" },
      { status: 500 }
    );
  }
}
