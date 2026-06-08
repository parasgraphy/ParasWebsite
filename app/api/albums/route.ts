import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function GET() {
  const albums = await sanityClient.fetch(
    `*[_type == "album"] | order(order asc) { _id, title, category }`,
  );
  return NextResponse.json(albums);
}

export async function POST(req: NextRequest) {
  const { title, category } = await req.json();
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const album = await sanityClient.create({
    _type: "album",
    title,
    category,
    slug: { _type: "slug", current: slug },
    visible: true,
    order: 0,
  });
  return NextResponse.json(album);
}

export async function DELETE(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get("albumId");
  // Delete all photos in album first
  const photos = await sanityClient.fetch(
    `*[_type == "photo" && album._ref == $albumId]{ _id }`,
    { albumId },
  );
  for (const photo of photos) {
    await sanityClient.delete(photo._id);
  }
  await sanityClient.delete(albumId!);
  return NextResponse.json({ success: true });
}
