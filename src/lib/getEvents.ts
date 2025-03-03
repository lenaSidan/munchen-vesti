export default getEventsByLocale;

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Интерфейс для статьи
export interface Event {
  slug: string;
  title: string;
  date?: string;
  time?: string;
  ort?: string;
  link?: string;
  content: string;
  image?: string;
}

// Функция загрузки статей по языку
export function getEventsByLocale(locale: string): Event[] {
  const eventsDir = path.join(process.cwd(), "public/events");
  const files = fs.readdirSync(eventsDir).filter((file) => file.endsWith(`.${locale}.md`));

  const events = files.map((file) => {
    const filePath = path.join(eventsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug: file.replace(`.${locale}.md`, ""),
      title: data.title || "Untitled",
      date: data.date || "Unknown date",
      time: data.time || "",
      ort: data.ort || "Unknown author", 
      link: data.link || "",
      content,
      image: data.image || null,
    };
  });


  // Сортируем статьи по дате (новые сверху)
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

