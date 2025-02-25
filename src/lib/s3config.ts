"use server";
// ref URL:// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadFileToS3 = async (file: File) => {
  try {
    const s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    // Upload file to S3
    const key = `uploads/${uuidv4()}_${file.name}`;
    const arrbuf = await file.arrayBuffer();
    const buffer = new Uint8Array(arrbuf);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };
    await s3.send(new PutObjectCommand(params));
    // Return S3 file URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return { success: true, status: 200, url: fileUrl };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return {
      success: false,
      status: 500,
      error: error,
    };
  }
};
export const deleteFileFromS3 = async (key: string) => {
  try {
    const s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };
    await s3.send(new DeleteObjectCommand(params));
    return { success: true, status: 200, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return {
      success: false,
      status: 500,
      error: error,
    };
  }
};
