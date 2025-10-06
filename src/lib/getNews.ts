import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface NewsItem {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  date?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  excerpt?: string;
}

/** Преобразует Markdown → HTML */
async function renderMarkdown(markdown: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return processed.toString();
}

/** Загружает и парсит все новости для текущей локали */
export async function getNewsByLocale(locale: string): Promise<NewsItem[]> {
  const newsDir = path.join(process.cwd(), "public/news");
  if (!fs.existsSync(newsDir)) return [];

  const files = fs.readdirSync(newsDir).filter((file) => file.endsWith(`.${locale}.md`));
  const newsList: NewsItem[] = [];

  for (const file of files) {
    const filePath = path.join(newsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Берём первый непустой абзац как excerpt
    const firstParagraph = content.split("\n").find((line) => line.trim()) || "";
    const excerpt = await renderMarkdown(firstParagraph.slice(0, 200) + "...");

    newsList.push({
      slug: file.replace(`.${locale}.md`, ""),
      title: data.title || "Без названия",
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      date: data.date || "",
      content,
      image: data.image || "",
      imageAlt: data.imageAlt || "",
      excerpt,
    });
  }

  // Сортировка по дате (новые — первыми)
  return newsList.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export default getNewsByLocale;
