import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().optional(),
    lang: z.string().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string().optional()
    }).optional(),
    tags: z.array(z.string()).optional(),
    layout: z.string()
  })
});

export const collections = { blog };