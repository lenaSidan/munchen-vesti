import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

export interface FullUsefulItem {
  slug: string;
  title: string;
  date?: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
  content: string;
  category?: string[] | string;
}

/** Загружает одну статью из /public/useful по slug и локали */
export async function getUsefulBySlug(slug: string, locale: string): Promise<FullUsefulItem | null> {
  const usefulDir = path.join(process.cwd(), "public/useful");
  const filePath = path.join(usefulDir, `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);

  return {
    slug,
    title: data.title || "Без названия",
    date: data.date ? String(data.date) : "",
    image: data.image || "",
    imageAlt: data.imageAlt || "",
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    summary: data.summary || "",
    content: processed.toString(),
    category: data.category || "",
  };
}
