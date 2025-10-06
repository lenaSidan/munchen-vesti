import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

export interface FullArticle {
  id: number;
  slug: string;
  title: string;
  shortTitle?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  image: string;
  imageAlt?: string;
  content: string;
}

export async function getArticleBySlug(slug: string, locale: string): Promise<FullArticle | null> {
  const articlesDir = path.join(process.cwd(), "public/articles");
  const filePath = path.join(articlesDir, `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);

  return {
    id: typeof data.id === "number" ? data.id : 0,
    slug,
    title: data.title || "Без названия",
    shortTitle: data.shortTitle || null,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    author: data.author || "",
    image: data.image || "",
    imageAlt: data.imageAlt || "",
    content: processedContent.toString(),
  };
}
