import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

export interface FullNewsItem {
  slug: string;
  title: string;
  date?: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  content: string;
}

/** Загружает одну новость по slug и локали */
export async function getNewsBySlug(slug: string, locale: string): Promise<FullNewsItem | null> {
  const newsDir = path.join(process.cwd(), "public/news");
  const filePath = path.join(newsDir, `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
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
    content: processed.toString(),
  };
}
