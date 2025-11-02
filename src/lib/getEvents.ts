import fs from "fs";
import matter from "gray-matter";
import path from "path";

// Интерфейс события
export interface Event {
  slug: string | string[];
  title: string;
  shortTitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  date?: string;
  endDate?: string;
  calendarStartDate?: string;
  calendarEndDate?: string;
  time?: string;
  ort: string;
  link: string;
  content: string;
  image?: string;
  imageAlt?: string;
  fileId: string;
}

// 🔧 Общая функция для загрузки событий из указанной директории
function getEventsFromDirectory(eventsDir: string, locale: string): Event[] {
  const files = fs.readdirSync(eventsDir).filter((file) => file.endsWith(`.${locale}.md`));

  const events = files.map((file) => {
    const filePath = path.join(eventsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // 💡 Генерация slug — поддержка массива, строки и fallback к имени файла
    let slugValue: string[];

    if (Array.isArray(data.slug)) {
      slugValue = data.slug.map((s: string) => s.toLowerCase().trim());
    } else if (typeof data.slug === "string" && data.slug.trim() !== "") {
      slugValue = [data.slug.toLowerCase().trim()];
    } else {
      // 🧩 Если slug не указан — берём имя файла без даты и без расширения
      const fallbackSlug = file
        .replace(`.${locale}.md`, "")
        .replace(/^\d{2}-\d{2}-\d{4}-/, "")
        .toLowerCase();
      slugValue = [fallbackSlug];
    }

    const fileId = file.replace(`.${locale}.md`, "");

    return {
      slug: slugValue,
      title: data.title || "Untitled",
      shortTitle: data.shortTitle || data.title || "Untitled",
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      date: data.date && !isNaN(new Date(data.date).getTime()) ? data.date : undefined,
      endDate: data.endDate || "",
      time: data.time || "",
      calendarStartDate: data.calendarStartDate || "",
      calendarEndDate: data.calendarEndDate || "",
      ort: data.ort || "",
      link: data.link ?? null,
      content,
      image: data.image ?? null,
      imageAlt: data.imageAlt ?? "",
      fileId,
    };
  });

  // ⚙️ Возвращаем только события с валидной датой
  return events.filter((event) => event.date && !isNaN(new Date(event.date).getTime()));
}

// 🎯 Будущие и текущие события
export function getEventsByLocale(locale: string): Event[] {
  const eventsDir = path.join(process.cwd(), "public/events");
  const allEvents = getEventsFromDirectory(eventsDir, locale);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return allEvents
    .filter((event) => {
      const start = new Date(event.date!);
      const end = event.endDate ? new Date(event.endDate) : start;
      return end.getTime() >= now.getTime(); // Событие ещё не завершилось
    })
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
}

// 📅 Прошедшие события
export function getPastEventsByLocale(locale: string): Event[] {
  const archiveDir = path.join(process.cwd(), "public/events/arhiv");
  const pastEvents = getEventsFromDirectory(archiveDir, locale);

  return pastEvents
    .filter((event) => {
      const end = event.endDate || event.date;
      return end && new Date(end).getTime() < Date.now(); // завершилось
    })
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // новые выше
}
