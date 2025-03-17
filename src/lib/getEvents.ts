export default getEventsByLocale;

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Интерфейс для статьи
export interface Event {
  slug: string;
  title: string;
  date?: string;
  endDate?: string;
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
      date: data.date && !isNaN(new Date(data.date).getTime()) ? data.date : undefined, // Проверяем валидность даты
      endDate: data.endDate || "",
      time: data.time || "",
      ort: data.ort || "",
      link: data.link ?? null, // Используем `null`, если ссылки нет
      content,
      image: data.image ?? null, // Используем `null`, если изображения нет
    };
  });

  // Фильтруем статьи с валидной датой и сортируем от ближайших событий до самых поздних
  return events
    .filter((event) => event.date && !isNaN(new Date(event.date).getTime())) // Исключаем события без валидной даты
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()); // Сортируем по возрастанию (сначала ближайшие)
}
