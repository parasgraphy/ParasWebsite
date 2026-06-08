import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@sanity/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "photographer-portfolio/about" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });

  const existing = await sanityClient.fetch(
    `*[_type == "homepageSettings"][0]{ _id }`,
  );

  const imageAsset = await sanityClient.create({
    _type: "sanity.imageAsset",
    url: uploadResult.secure_url,
    originalFilename: file.name,
  });

  const aboutPhotoObj = {
    _type: "image",
    asset: { _type: "reference", _ref: imageAsset._id },
  };

  if (existing?._id) {
    await sanityClient
      .patch(existing._id)
      .set({ aboutPhoto: aboutPhotoObj })
      .commit();
  } else {
    await sanityClient.create({
      _type: "homepageSettings",
      aboutPhoto: aboutPhotoObj,
    });
  }

  return NextResponse.json({ success: true, url: uploadResult.secure_url });
}
