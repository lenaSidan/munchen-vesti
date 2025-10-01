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

  const events = getEventsByLocale(locale as string);
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const html = await processMarkdown(event.content);
  res.status(200).json({ content: html });
}
