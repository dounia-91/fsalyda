// pages/api/get-presigned-url.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export default async function handler(req:any, res:any) {
  const { filename, contentType } = req.body;
  const s3 = new S3Client({ region: process.env.AWS_REGION! });
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `audio/${filename}`,
    ContentType: contentType,
  });
  
  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  const fileUrl = `https://YOUR_BUCKET.s3.amazonaws.com/audio/${filename}`;
  res.status(200).json({ url, fileUrl });
}