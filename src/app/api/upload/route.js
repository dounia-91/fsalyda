import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const form = new IncomingForm();
  form.uploadDir = '/tmp';
  form.keepExtensions = true;

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(NextResponse.json({ error: err.message }));

      const file = files.file;
      if (!file) return reject(NextResponse.json({ error: 'No file uploaded' }));

      try {
        const uploadRes = await cloudinary.uploader.upload(file.filepath, {
          resource_type: 'auto',
        });

        fs.unlinkSync(file.filepath); // nettoyer fichier temporaire

        resolve(NextResponse.json({ url: uploadRes.secure_url }));
      } catch (error) {
        reject(NextResponse.json({ error: error.message }));
      }
    });
  });
}
