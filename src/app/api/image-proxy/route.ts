import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {

  // await s3.send(new PutObjectCommand(params));

  const url = new URL(req.url);
  const key = url.searchParams.get("key"); // e.g., "uploads/my-image.jpg"

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });
    
    const s3Response = await s3.send(command);

    // s3Response.Body is a stream
    const body = s3Response.Body as ReadableStream<Uint8Array>;
    const contentType = s3Response.ContentType || "application/octet-stream";
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("S3 fetch error:", err);
    console.error("Bucket:", process.env.S3_BUCKET_NAME);
    console.error("Key:", key);
    return NextResponse.json({ error: "Image not found or S3 access error", details: String(err) }, { status: 404 });
  }
}