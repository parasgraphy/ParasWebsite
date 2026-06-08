import { createClient } from "@sanity/client";
import GalleryClient from "./GalleryClient";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const revalidate = 60;

export default async function GalleryPage() {
  const albums = await sanityClient.fetch(
    `*[_type == "album" && visible == true] | order(order asc) {
      _id, title, category, slug
    }`,
  );

  const photos = await sanityClient.fetch(
    `*[_type == "photo" && visible == true] | order(order asc) {
      _id,
      "url": image.url,
      order,
      "albumId": album._ref
    }`,
  );

  return <GalleryClient albums={albums} photos={photos} />;
}
