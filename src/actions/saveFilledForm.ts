import { prisma } from '../lib/prisma';

interface SaveFilledFormData {
  filledById: string;
  filledByEmail: string;
  companyId: string;
  formTemplateId: string;
  title: string;
  formData: Record<string, unknown>; // typage plus précis que any
  files: { url: string; type: string }[];
}

export async function SaveFilledForm(data: SaveFilledFormData) {
  const {
    filledById,
    filledByEmail,
    companyId,
    formTemplateId,
    title,
    formData,
    files,
  } = data;

  const newForm = await prisma.form.create({
    data: {
      filledByUserId: filledById,
      companyId,
      templateId: formTemplateId,
      data: formData,
      files: {
        create: files,
      },
    },
  });

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
  });

  const managers = await prisma.user.findMany({
    where: {
      role: "MANAGER",
      companyId: companyId,
    },
  });

  const recipients = [...admins, ...managers];

  await Promise.all(
    recipients.map(user =>
      prisma.notification.create({
        data: {
          type: "info",
          content: `Le formulaire "${title}" a été rempli par ${filledByEmail}`,
          recipient: user.email,
        },
      })
    )
  );

  return newForm;
}
