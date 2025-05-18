"use server";
import { prisma } from "@/lib/prisma"; // ton client Prisma
import { uploadFileToS3 } from "@/lib/s3config"; // ta fonction d’upload sur S3

import { FormItemDetails, FormState } from "@/types/types";

export const SaveFilledForm = async (
  companyName: string,
  title: string,
  recordData: FormData,
  formItemD: FormItemDetails[],
  filledByEmail: string
) => {
  const recordState: FormState = {};
  let listCount = 0;
  let attachmentCount = 0;
  let photoCount = 0;
  let tableColCount = 0;

  const entries = Array.from(recordData.entries());

  // Traitement des champs selon type
  await Promise.all(
    formItemD.map(async (itemD) => {
      if (itemD.title === "Photo") {
        photoCount = entries.filter((e) => e[0].includes(itemD.newTitle)).length;
        const photoArr: string[] = [];
        for (let i = 0; i < photoCount; i++) {
          const file = recordData.get(`${itemD.newTitle}[${i}]`) as File;
          if (file) {
            const { success, url } = await uploadFileToS3(file);
            if (success && url) photoArr.push(url);
          }
        }
        recordState[itemD.newTitle] = photoArr;
      } else if (itemD.title === "Attached file") {
        attachmentCount = entries.filter((e) => e[0].includes(itemD.newTitle)).length;
        const attachArr: string[] = [];
        for (let i = 0; i < attachmentCount; i++) {
          const file = recordData.get(`${itemD.newTitle}[${i}]`) as File;
          if (file) {
            const { success, url } = await uploadFileToS3(file);
            if (success && url) attachArr.push(url);
          }
        }
        recordState[itemD.newTitle] = attachArr;
      } else if (itemD.title === "List") {
        if (itemD.listMultipleSelection) {
          listCount = entries.filter((e) => e[0].includes(itemD.newTitle)).length;
          const ListArr: string[] = [];
          for (let i = 0; i < listCount; i++) {
            const val = recordData.get(`${itemD.newTitle}[${i}]`) as string;
            if (val) ListArr.push(val);
          }
          recordState[itemD.newTitle] = ListArr;
        } else {
          recordState[itemD.newTitle] = recordData.get(itemD.newTitle) as string;
        }
      } else if (itemD.title === "Voice Recorder") {
        const file = recordData.get(itemD.newTitle) as File;
        if (file) {
          const { success, url } = await uploadFileToS3(file);
          if (success && url) recordState[itemD.newTitle] = url;
        }
      } else if (itemD.title === "Table") {
        const tableRowCount = parseInt(recordData.get(`${itemD.newTitle}RowCount`) as string) || 0;
        tableColCount = entries.filter((e) => e[0].includes(`${itemD.newTitle}[0]`)).length;
        const table: string[][] = [];
        for (let i = 0; i < tableRowCount; i++) {
          const rowArr: string[] = [];
          for (let j = 0; j < tableColCount; j++) {
            rowArr.push(recordData.get(`${itemD.newTitle}[${i}][${j}]`) as string);
          }
          table.push(rowArr);
        }
        recordState[itemD.newTitle] = table;
      } else {
        recordState[itemD.newTitle] = recordData.get(itemD.newTitle) as string;
      }
    })
  );

  try {
    // Sauvegarde dans la base avec Prisma
    // On récupère d'abord l'ID de l'utilisateur qui a rempli le formulaire
    const filledBy = await prisma.businessUser.findUnique({
      where: { email: filledByEmail },
    });

    if (!filledBy) {
      return { success: false, message: "Utilisateur non trouvé", status: 404 };
    }

    // Création du formulaire rempli
    const newFilledForm = await prisma.filledForm.create({
      data: {
        companyName,
        title,
        filledById: filledBy.id,
        formState: recordState,
        formItemDetails: formItemD,
      },
    });

    // Notifications : on récupère tous les admins et managers de la company
    const admins = await prisma.admin.findMany();
    const managers = await prisma.businessUser.findMany({
      where: { companyName },
    });

    const toUsersEmails = [
      ...admins.map((a) => a.email),
      ...managers.map((m) => m.email),
    ].filter((email) => email !== filledByEmail); // retirer celui qui a rempli

    // Création des notifications pour chacun
    await Promise.all(
      toUsersEmails.map(async (email) => {
        const toUser = await prisma.businessUser.findUnique({ where: { email } });
        if (toUser) {
          await prisma.notification.create({
            data: {
              title: "Nouveau formulaire soumis",
              message: `Le formulaire "${title}" a été rempli par ${filledByEmail} pour la société ${companyName}`,
              toUserId: toUser.id,
              fromUserId: filledBy.id,
            },
          });
        }
      })
    );

    return { success: true, message: "Formulaire sauvegardé avec succès", status: 200 };
  } catch (error) {
    console.error("Erreur SaveFilledForm :", error);
    return { success: false, message: "Erreur lors de la sauvegarde du formulaire", status: 500 };
  }
};
