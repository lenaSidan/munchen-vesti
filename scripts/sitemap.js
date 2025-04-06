// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const baseUrl = "https://munchen-vesti.de";

const staticPages = [
  "",
  "/about",
  "/contacts",
  "/privacy-policy",
  "/impressum",
  "/articles-page",
  "/events-page",
  "/ads-food-page",
  "/ads-other-page",
  "/ads-services-page",
  "/ads-studios-page",
  "/education-page",
];

function getMarkdownUrls(folder, prefix, filterFutureEvents = false) {
  const dirPath = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".md"));

  return files
  .map((file) => {
    const [filename, locale] = file.replace(".md", "").split(".");
    const slug = filename.replace(/^\d{2}-\d{2}-\d{4}-/, ""); // убираем дату в начале
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, "utf-8");
    const match = content.match(/date:\s*(.+)/); // Найти дату
    const date = match ? new Date(match[1]) : null;

    if (filterFutureEvents && date && date < new Date()) return null; // Убираем прошедшие

    return `<url><loc>${baseUrl}${locale === "de" ? "/de" : ""}/${prefix}/${slug}</loc><changefreq>weekly</changefreq></url>`;
  })
  .filter(Boolean);

}

function generateSitemap() {
  const urls = staticPages.map(
    (page) => `<url><loc>${baseUrl}${page}</loc><changefreq>weekly</changefreq></url>`
  );

  const newsUrls = getMarkdownUrls("news", "news");
  const articlesUrls = getMarkdownUrls("articles", "articles");
  const eventsUrls = getMarkdownUrls("events", "events", true); // Только будущие события

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls, ...newsUrls, ...eventsUrls, ...articlesUrls].join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
  console.log("✅ Sitemap generated!");
}

generateSitemap();
