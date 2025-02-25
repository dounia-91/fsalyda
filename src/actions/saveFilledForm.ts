"use server";
import dbConnect from "../lib/dbConnect";
import FilledFormModel from "@/model/filledForm";
import { FormItemDetails, FormState } from "@/types/types";
import AdminModel, { Admin } from "@/model/admin";
import BusinessUserModel, { BusinessUser } from "@/model/businessUser";
import NotificationModel from "@/model/notification";
import { uploadFileToS3 } from "@/lib/s3config";

export const SaveFilledForm = async (
  companyName: string,
  title: string,
  recordData: FormData,
  formItemD: FormItemDetails[],
  filledBy: string
) => {
  const recordState: FormState = {};
  let listCount: number = 0;
  let attachmentCount: number = 0;
  let photoCount: number = 0;
  let tableColCount: number = 0;
  const entries = Array.from(recordData.entries());
  await Promise.all(
    formItemD.map(async (itemD) => {
      if (itemD.title === "Photo") {
        entries.forEach((entry) => {
          if (entry[0].includes(itemD.newTitle)) {
            photoCount++;
          }
        });
        const photoArr: string[] = [];
        for (let i = 0; i < photoCount; i++) {
          const { success, url } = await uploadFileToS3(
            recordData.get(`${itemD.newTitle}[${i}]`) as File
          );
          if (success) photoArr.push(url!);
        }
        recordState[itemD.newTitle] = photoArr;
      } else if (itemD.title === "Attached file") {
        entries.forEach((entry) => {
          if (entry[0].includes(itemD.newTitle)) {
            attachmentCount++;
          }
        });
        const attachArr: string[] = [];
        for (let i = 0; i < attachmentCount; i++) {
          const { success, url } = await uploadFileToS3(
            recordData.get(`${itemD.newTitle}[${i}]`) as File
          );
          if (success) attachArr.push(url!);
        }
        recordState[itemD.newTitle] = attachArr;
      } else if (itemD.title === "List") {
        if (itemD.listMultipleSelection) {
          entries.forEach((entry) => {
            if (entry[0].includes(itemD.newTitle)) {
              listCount++;
            }
          });
          const ListArr: string[] = [];
          for (let i = 0; i < listCount; i++) {
            ListArr.push(recordData.get(`${itemD.newTitle}[${i}]`) as string);
          }
          recordState[itemD.newTitle] = ListArr;
        } else {
          recordState[itemD.newTitle] = recordData.get(
            `${itemD.newTitle}`
          ) as string;
        }
      } else if (itemD.title === "Voice Recorder") {
        const { success, url } = await uploadFileToS3(
          recordData.get(`${itemD.newTitle}`) as File
        );
        if (success) recordState[itemD.newTitle] = url!;
      } else if (itemD.title === "Table") {
        const tableRowCount = parseInt(
          recordData.get(`${itemD.newTitle}RowCount`) as string
        );
        entries.forEach((entry) => {
          if (entry[0].includes(`${itemD.newTitle}[0]`)) {
            tableColCount++;
          }
        });
        const table: string[][] = [];
        for (let i = 0; i < tableRowCount; i++) {
          const rowArr: string[] = [];
          for (let j = 0; j < tableColCount; j++) {
            rowArr.push(
              recordData.get(`${itemD.newTitle}[${i}][${j}]`) as string
            );
          }
          table.push(rowArr);
        }
        recordState[itemD.newTitle] = table;
      } else {
        recordState[itemD.newTitle] = recordData.get(itemD.newTitle) as string;
      }
    })
  );
  await dbConnect();
  try {
    const newForm = new FilledFormModel({
      companyName,
      title,
      formState: recordState,
      formItemDetails: formItemD,
      filledBy,
    });
    await newForm.save();
    const toUsers: string[] = [];
    const admins = await AdminModel.find();
    admins.map((a: Admin) => toUsers.push(a.email));
    const managers = await BusinessUserModel.find({ companyName });
    managers.map((m: BusinessUser) => toUsers.push(m.email));
    if (toUsers.includes(filledBy)) {
      const index = toUsers.indexOf(filledBy);
      toUsers.splice(index, 1);
    }
    await Promise.all(
      toUsers.map(async (u: string) => {
        const notification = new NotificationModel({
          title: "New Form Submission",
          message: `There is a new submission for the form ${title}, by ${filledBy}, for the company ${companyName}`,
          toUser: u,
          fromUser: filledBy,
        });
        await notification.save();
      })
    );
    return { success: true, message: "Record Saved successfully", status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error saving Record", status: 400 };
  }
};
