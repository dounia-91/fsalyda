import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: NextRequest) {
    try {
          const { filename, contentType } = await req.json();

      if (!filename) {
              return NextResponse.json({ error: "filename is required" }, { status: 400 });
      }

      const s3 = new S3Client({
              region: process.env.AWS_REGION!,
              credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
              },
      });

      const bucketName = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET_NAME!;

      const command = new PutObjectCommand({
              Bucket: bucketName,
              Key: `audio/${filename}`,
              ContentType: contentType || "audio/webm",
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
          const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/audio/${filename}`;

      return NextResponse.json({ url, fileUrl }, { status: 200 });
    } catch (error) {
          console.error("Error generating presigned URL:", error);
          return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
