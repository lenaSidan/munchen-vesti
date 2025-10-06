import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface Article {
  id: number;
  slug: string;
  title: string;
  shortTitle?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  content: string;
}

export function getArticlesByLocale(locale: string): Article[] {
  const summariesDir = path.join(process.cwd(), "public/articles_summaries");
  if (!fs.existsSync(summariesDir)) return [];

  const files = fs.readdirSync(summariesDir);
  const localeFiles = files.filter((file) => file.endsWith(`.${locale}.md`));

  const articles: Article[] = [];

  for (const file of localeFiles) {
    const filePath = path.join(summariesDir, file);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);

    // Обрабатываем Markdown → HTML (как раньше в getStaticProps)
    const processed = remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(content);

    articles.push({
      id: data.id || 0,
      slug: file.replace(`.${locale}.md`, ""),
      title: data.title || "Без названия",
      shortTitle: data.shortTitle || null,
      author: data.author || "",
      image: data.image || null,
      imageAlt: data.imageAlt || "",
      content: processed.toString(),
    });
  }

  // Сортировка от новых к старым
  return articles.sort((a, b) => b.id - a.id);
}
