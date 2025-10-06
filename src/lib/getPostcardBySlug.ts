import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeExternalLinks from "rehype-external-links";

export interface FullPostcard {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  content: string;
  image: string;
}

/** Добавляет версию к картинке по времени изменения файла */
function getImageWithVersion(imagePath: string): string {
  const fullPath = path.join(process.cwd(), "public", imagePath.replace(/^\/+/, ""));
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const timestamp = stats.mtime.getTime();
    return `${imagePath}?v=${timestamp}`;
  }
  return imagePath;
}

/** Загружает открытку по slug и locale */
export async function getPostcardBySlug(slug: string, locale: string): Promise<FullPostcard | null> {
  const dir = path.join(process.cwd(), "public/postcards-md");
  const filePath = path.join(dir, `${slug}.${locale}.md`);

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

  const imagePath = data.image || `/postcards/full/${slug}.webp`;
  const versionedImage = getImageWithVersion(imagePath);

  return {
    slug,
    title: data.title || slug,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    content: processed.toString(),
    image: versionedImage,
  };
}
