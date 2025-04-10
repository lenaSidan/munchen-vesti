export default getEventsByLocale;

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Интерфейс для статьи
export interface Event {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  date?: string;
  endDate?: string;
  time?: string;
  ort?: string;
  link: string;
  content: string;
  image?: string;
  imageAlt?: string;
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
      slug: file.replace(`.${locale}.md`, "").replace(/^\d{2}-\d{2}-\d{4}-/, ""),
      title: data.title || "Untitled",
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      date: data.date && !isNaN(new Date(data.date).getTime()) ? data.date : undefined,
      endDate: data.endDate || "",
      time: data.time || "",
      ort: data.ort || "",
      link: data.link ?? null,
      content,
      image: data.image ?? null,
      imageAlt: data.imageAlt ?? "",
    };
  });

  // Фильтруем статьи с валидной датой и сортируем от ближайших событий до самых поздних
  return events
    .filter((event) => event.date && !isNaN(new Date(event.date).getTime())) // Исключаем события без валидной даты
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()); // Сортируем по возрастанию (сначала ближайшие)
}
