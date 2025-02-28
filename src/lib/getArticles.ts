export default getArticlesByLocale;

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Интерфейс для статьи
export interface Article {
  slug: string;
  title: string;
  date: string;
  author?: string;
  content: string;
  image?: string;
}

// Функция загрузки статей по языку
export function getArticlesByLocale(locale: string): Article[] {
  const articlesDir = path.join(process.cwd(), "public/articles");
  const files = fs.readdirSync(articlesDir).filter((file) => file.endsWith(`.${locale}.md`));

  const articles = files.map((file) => {
    const filePath = path.join(articlesDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug: file.replace(`.${locale}.md`, ""),
      title: data.title || "Без названия",
      date: data.date || "Неизвестная дата",
      author: data.author || "Неизвестный автор", // 🛠 Добавляем поле author
      content,
      image: data.image || null,
    };
  });


  // Сортируем статьи по дате (новые сверху)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

