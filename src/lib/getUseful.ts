import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface UsefulItem {
  slug: string;
  title: string;
  date?: string;
  image?: string;
  imageAlt?: string;
  summaryHtml: string;
  category?: string;
}

/** Markdown → HTML */
async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return processed.toString();
}

/** Получаем все статьи из /public/useful для текущей локали */
export async function getUsefulByLocale(locale: string): Promise<UsefulItem[]> {
  const usefulDir = path.join(process.cwd(), "public/useful");
  if (!fs.existsSync(usefulDir)) return [];

  const files = fs.readdirSync(usefulDir).filter((f) => f.endsWith(`.${locale}.md`));
  const items: UsefulItem[] = [];

  for (const filename of files) {
    const filePath = path.join(usefulDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const slug = path.basename(filename, `.${locale}.md`);
    const summarySrc = (data.summary || data.description || "").toString().trim();

    let summaryHtml = "";
    if (summarySrc) {
      summaryHtml = await markdownToHtml(summarySrc);
    } else {
      const firstParagraph = (content.split("\n").find((line) => line.trim()) || "").slice(0, 200) + "...";
      summaryHtml = await markdownToHtml(firstParagraph);
    }

    items.push({
      slug,
      title: data.title || "Без названия",
      date: data.date || "",
      image: data.image || "",
      imageAlt: data.imageAlt || data.title || "",
      summaryHtml,
      category: data.category || "",
    });
  }

  return items;
}
