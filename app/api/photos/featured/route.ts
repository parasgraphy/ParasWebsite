import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function GET() {
  const photos = await sanityClient.fetch(
    `*[_type == "photo" && visible == true] | order(order asc)[0...7] {
      _id,
      "url": image.url,
    }`,
  );
  return NextResponse.json(photos);
}
