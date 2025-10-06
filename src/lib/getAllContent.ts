import fs from "fs";
import path from "path";
import { getArticlesByLocale } from "./getArticles";
import { getEventsByLocale } from "./getEvents";
import getNewsByLocale from "./getNews";
import { getPlacesByCategory } from "./getPlacesByCategory";
import { getPostcardsByLocale } from "./getPostcards";
import { getUsefulByLocale } from "./getUseful";

export type SearchItem = {
  title: string;
  url: string;
  fileId?: string;
  slug: string[];
  category: string;
};

export async function getAllSearchableItems(locale: string): Promise<SearchItem[]> {
  const allItems: SearchItem[] = [];

  // 🗓️ События
  const events = getEventsByLocale(locale);
  for (const e of events) {
    allItems.push({
      title: e.title,
      slug: Array.isArray(e.slug) ? e.slug : [String(e.slug)],
      fileId: e.fileId,
      category: "events",
      url: `/${locale}/events-page#${encodeURIComponent(e.fileId)}`,
    });
  }

  // 📰 Новости
  const news = await getNewsByLocale(locale);
  for (const n of news) {
    allItems.push({
      title: n.title,
      slug: [n.slug],
      category: "news",
      url: `/${locale}/news/${n.slug}`,
    });
  }

  // 📚 Статьи
  const articles = getArticlesByLocale(locale);
  for (const a of articles) {
    allItems.push({
      title: a.title,
      slug: [a.slug],
      category: "articles",
      url: `/${locale}/articles/${a.slug}`,
    });
  }

  // 💡 Полезные советы
  const usefulItems = await getUsefulByLocale(locale);
  for (const u of usefulItems) {
    allItems.push({
      title: u.title,
      slug: [u.slug],
      category: "useful",
      url: `/${locale}/useful/${u.slug}`,
    });
  }

  // 🌍 Места (places)
  const placesDir = path.join(process.cwd(), "public/places");
  if (fs.existsSync(placesDir)) {
    const categories = fs
      .readdirSync(placesDir)
      .filter((d) => fs.statSync(path.join(placesDir, d)).isDirectory());

    for (const category of categories) {
      const places = getPlacesByCategory(category, locale);
      for (const p of places) {
        allItems.push({
          title: p.title,
          slug: [category, p.slug],
          category: "places",
          url: `/${locale}/places/${category}/${p.slug}`,
        });
      }
    }
  }

  // ✉️ Открытки
  const postcards = getPostcardsByLocale(locale);
  for (const p of postcards) {
    allItems.push({
      title: p.title,
      slug: [p.slug],
      category: "postcards",
      url: `/${locale}/postcards/${p.slug}`,
    });
  }

  return allItems;
}
