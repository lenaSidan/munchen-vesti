import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

export interface GeocachePage {
  slug: string;
  title: string;
  image?: string;
  imageAlt?: string;
  content: string;
  otherPages: {
    slug: string;
    title: string;
    description: string;
    image?: string;
  }[];
}

export async function getGeocacheBySlug(slug: string, locale: string): Promise<GeocachePage | null> {
  const dir = path.join(process.cwd(), "public/geocaching");
  const filePath = path.join(dir, `${slug}.${locale}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);

  const allPages = [
    {
      slug: "sightseeing-caches",
      title: locale === "de" ? "Tarnungen bei Sehenswürdigkeiten" : "Тайники у достопримечательностей",
      description: locale === "de" ? "Erforschen Sie München neu." : "Исследуйте Мюнхен по-новому.",
      image: "/geocaching_images/sightseeing.webp",
    },
    {
      slug: "night-adventures",
      title: locale === "de" ? "Nächtliche Abenteuer (N8@MUC)" : "Ночные приключения (N8@MUC)",
      description: locale === "de"
        ? "Wenn die Stadt schläft, erwachen unsere Caches zum Leben."
        : "Фонарик, темнота, и вы — как в квесте.",
      image: "/geocaching_images/night.webp",
    },
    {
      slug: "hiking-caches",
      title: locale === "de" ? "Wander-Caches" : "Прогулки и походы",
      description: locale === "de"
        ? "Geocaching entlang von Waldwegen und Flüssen."
        : "Тайники на выходных: леса, тропы, поля, реки.",
      image: "/geocaching_images/hiking.webp",
    },
    {
      slug: "creative-hides",
      title: locale === "de" ? "Kreative Verstecke" : "Самые необычные тайники",
      description: locale === "de"
        ? "Verblüffende Orte und Rätsel – für erfahrene Geocacher."
        : "Тайники, которые удивят даже профи.",
      image: "/geocaching_images/highlights.webp",
    },
    {
      slug: "family-caching",
      title: locale === "de" ? "Familiencaching" : "Для детей и всей семьи",
      description: locale === "de"
        ? "Einfache Caches für den ersten Einstieg mit Kindern."
        : "Добрые, весёлые задания и первая карта.",
      image: "/geocaching_images/family.webp",
    },
    {
      slug: "paranoia-at-night",
      title: "Paranoia@Night",
      description: locale === "de"
        ? "Legendärer Einzelspieler-Cache mit düsterer Atmosphäre."
        : "Мрачная легенда для тех, кто не боится одиночества.",
      image: "/geocaching_images/paranoia.webp",
    },
  ];

  const otherPages = allPages.filter((p) => p.slug !== slug);

  return {
    slug,
    title: data.title || "",
    image: data.image || "",
    imageAlt: data.imageAlt || "",
    content: processed.toString(),
    otherPages,
  };
}
