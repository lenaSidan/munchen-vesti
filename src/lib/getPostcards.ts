import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Postcard {
  slug: string;
  image: string;
  title: string;
}

/** Возвращает путь к картинке с версией по времени изменения файла */
function getImageWithVersion(imagePath: string): string {
  const fullPath = path.join(process.cwd(), "public", imagePath.replace(/^\/+/, ""));
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const timestamp = stats.mtime.getTime();
    return `${imagePath}?v=${timestamp}`;
  }
  return imagePath;
}

/** Получает все открытки для указанной локали */
export function getPostcardsByLocale(locale: string): Postcard[] {
  const dir = path.join(process.cwd(), "public/postcards-md");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(`.${locale}.md`));
  const postcards: Postcard[] = [];

  for (const file of files) {
    const slug = file.replace(`.${locale}.md`, "");
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    const imagePath = data.image || `/postcards/full/${slug}.webp`;
    const versionedImage = getImageWithVersion(imagePath);

    postcards.push({
      slug,
      image: versionedImage,
      title: data.title || slug,
    });
  }

  return postcards;
}
