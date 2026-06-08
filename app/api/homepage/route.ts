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
  const settings = await sanityClient.fetch(`
    *[_type == "homepageSettings"][0] {
      "heroPhotos": heroPhotos[]-> {
        _id,
        "url": image.url,
      },
      "portfolioPhotos": portfolioPhotos[]-> {
        _id,
        "url": image.url,
      },
      "weddingBanner": weddingBanner-> {
        _id,
        "url": image.url,
      },
      "aboutPhoto": aboutPhoto.asset->url,
    }
  `);
  return NextResponse.json(settings || {});
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { heroPhotos, portfolioPhotos, weddingBanner, aboutPhoto } = body;

  // Check if document exists
  const existing = await sanityClient.fetch(
    `*[_type == "homepageSettings"][0]{ _id }`,
  );

  const doc: any = {
    _type: "homepageSettings",
  };

  if (heroPhotos) {
    doc.heroPhotos = heroPhotos.map((id: string) => ({
      _type: "reference",
      _ref: id,
      _key: id,
    }));
  }

  if (portfolioPhotos) {
    doc.portfolioPhotos = portfolioPhotos.map((id: string) => ({
      _type: "reference",
      _ref: id,
      _key: id,
    }));
  }

  if (weddingBanner) {
    doc.weddingBanner = { _type: "reference", _ref: weddingBanner };
  }

  if (existing?._id) {
    await sanityClient.patch(existing._id).set(doc).commit();
  } else {
    await sanityClient.create(doc);
  }

  return NextResponse.json({ success: true });
}
