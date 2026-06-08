import { defineField, defineType } from "sanity";

export const homepageSettings = defineType({
  name: "homepageSettings",
  title: "Homepage Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroPhotos",
      title: "Hero Strip Photos (max 6)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "photo" }] }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "portfolioPhotos",
      title: "Portfolio Preview Photos (max 9)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "photo" }] }],
      validation: (Rule) => Rule.max(9),
    }),
    defineField({
      name: "weddingBanner",
      title: "Wedding Banner Photo",
      type: "reference",
      to: [{ type: "photo" }],
    }),
    defineField({
      name: "aboutPhoto",
      title: "About / Bio Photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage Settings" };
    },
  },
});
