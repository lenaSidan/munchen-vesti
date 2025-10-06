import type { NextApiRequest, NextApiResponse } from "next";
import { getEventsByLocale } from "@/lib/getEvents";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeExternalLinks from "rehype-external-links";

async function processMarkdown(content: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, locale = "ru" } = req.query;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug required" });
  }

  try {
    const events = getEventsByLocale(locale as string);
    const slugLower = slug.toLowerCase();

    // ✅ Ищем совпадение по строке или массиву slug
    const event = events.find((e) =>
      Array.isArray(e.slug)
        ? e.slug.some((s) => s.toLowerCase() === slugLower)
        : e.slug.toLowerCase() === slugLower
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const html = await processMarkdown(event.content);
    return res.status(200).json({ content: html });
  } catch (error) {
    console.error("API error in /api/event/[slug]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
