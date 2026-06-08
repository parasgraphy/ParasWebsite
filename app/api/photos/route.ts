import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function GET(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get("albumId");
  const photos = await sanityClient.fetch(
    `*[_type == "photo" && album._ref == $albumId] | order(order asc) {
      _id, image, visible, order, album
    }`,
    { albumId },
  );
  return NextResponse.json(photos);
}

export async function PATCH(req: NextRequest) {
  const { photoId, visible } = await req.json();
  await sanityClient.patch(photoId).set({ visible }).commit();
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { photos } = await req.json();
  const transaction = sanityClient.transaction();
  photos.forEach(({ id, order }: { id: string; order: number }) => {
    transaction.patch(id, (p) => p.set({ order }));
  });
  await transaction.commit();
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const photoId = req.nextUrl.searchParams.get("photoId");
  await sanityClient.delete(photoId!);
  return NextResponse.json({ success: true });
}
