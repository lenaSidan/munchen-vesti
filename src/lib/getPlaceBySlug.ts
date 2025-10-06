import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

export interface PlaceArticle {
  category: string;
  slug: string;
  title: string;
  content: string;
  image?: string;
  imageAlt?: string;
}

/** Получает статью о месте по категории и slug */
export async function getPlaceBySlug(category: string, slug: string, locale: string): Promise<PlaceArticle | null> {
  const baseDir = path.join(process.cwd(), "public/places", category);
  const filePath = path.join(baseDir, `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);

  return {
    category,
    slug,
    title: data.title || slug,
    image: data.image || "",
    imageAlt: data.imageAlt || "",
    content: processed.toString(),
  };
}
