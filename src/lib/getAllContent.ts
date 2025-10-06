import { getEventsByLocale } from "./getEvents";

export type SearchItem = {
  title: string;
  url: string;
  fileId: string;
  slug: string[];
};

export function getAllSearchableItems(locale: string): SearchItem[] {
  const events = getEventsByLocale(locale);

  return events.map((item) => ({
    title: item.title,
    slug: Array.isArray(item.slug)
      ? item.slug
      : [String(item.slug)],
    fileId: item.fileId,
    url: `/${locale}/events-page#${encodeURIComponent(item.fileId)}`,
  }));
}
