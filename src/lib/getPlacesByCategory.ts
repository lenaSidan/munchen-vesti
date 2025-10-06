import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PlaceMeta {
  slug: string;
  title: string;
  description: string;
  image?: string;
}

/**
 * Получает список всех мест (Place) для заданной категории и языка.
 * Пример: getPlacesByCategory("parks", "ru")
 */
export function getPlacesByCategory(category: string, locale: string): PlaceMeta[] {
  const baseDir = path.join(process.cwd(), "public/places", category);

  if (!fs.existsSync(baseDir)) return [];

  const files = fs.readdirSync(baseDir).filter((file) => file.endsWith(`.${locale}.md`));
  const places: PlaceMeta[] = [];

  for (const file of files) {
    const filePath = path.join(baseDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    const slug = file.replace(`.${locale}.md`, "");

    places.push({
      slug,
      title: data.title || slug,
      description: data.description || "",
      image: data.image || "",
    });
  }

  return places;
}
