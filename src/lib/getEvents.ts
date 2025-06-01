import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Интерфейс события
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

// 🔧 Общая функция для загрузки событий из указанной директории
function getEventsFromDirectory(eventsDir: string, locale: string): Event[] {
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
