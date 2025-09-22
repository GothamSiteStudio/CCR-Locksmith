import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "CCR/Alpha Locksmith Blog",
    description: "Tips & guides from a mobile locksmith.",
    site: context.site?.toString() ?? "",
    items: posts.map(p => ({
      title: p.data.title,
      description: p.data.description,
      link: `/blog/${p.slug}/`,
      pubDate: new Date(p.data.pubDate),
    })),
  });
}