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

// Функция для рендеринга одного параграфа Markdown в HTML
async function renderExcerpt(markdown: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return processed.toString();
}

export async function getNewsByLocale(locale: string): Promise<NewsItem[]> {
  const newsDir = path.join(process.cwd(), "public/news");
  const files = fs.readdirSync(newsDir).filter((file) => file.endsWith(`.${locale}.md`));

  const newsList: NewsItem[] = [];

  for (const file of files) {
    const filePath = path.join(newsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const firstParagraph = content.split("\n").find((line) => line.trim().length > 0) || "";
    const excerpt = await renderExcerpt(firstParagraph);

    newsList.push({
      slug: file.replace(`.${locale}.md`, "").replace(/^\d{2}-/, ""),
      title: data.title || "Untitled",
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      date: data.date || "",
      image: data.image || "",
      imageAlt: data.imageAlt || "",
      content,
      excerpt, // 👉 уже отрендерено как HTML
    });
  }

  return newsList.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
}

export default getNewsByLocale;
