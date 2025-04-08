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

// 🔍 Читаем Markdown и определяем актуальность события
function getMarkdownUrls(folder, prefix, checkEventDates = false, priority = "0.6") {
  const dirPath = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".md"));

  return files
    .map((file) => {
      const [filename, locale] = file.replace(".md", "").split(".");
      const slug = filename.replace(/^\d{2}-\d{2}-\d{4}-/, "");
      const content = fs.readFileSync(path.join(dirPath, file), "utf-8");

      if (checkEventDates) {
        const dateMatch = content.match(/date:\s*(.+)/);
        const endDateMatch = content.match(/endDate:\s*(.+)/);
        const startDate = dateMatch ? new Date(dateMatch[1]) : null;
        const endDate = endDateMatch ? new Date(endDateMatch[1]) : startDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!startDate || endDate < today) return null;
      }

      const localePrefix = locale === "de" ? "/de" : "";
      return `<url><loc>${baseUrl}${localePrefix}/${prefix}/${slug}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
    })
    .filter(Boolean);
}

function generateSitemap() {
  const urls = staticPages.map((page) => {
    const fullUrl = `${baseUrl}${page}`;
    const changefreq = page === "" ? "daily" : "weekly";
    const priority = page === "" ? "1.0" : "0.5";

    return `<url><loc>${fullUrl}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  });

  const newsUrls = getMarkdownUrls("news", "news", false, "0.6");
  const articlesUrls = getMarkdownUrls("articles", "articles", false, "0.7");
  const eventsUrls = getMarkdownUrls("events", "events", true, "0.9");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls, ...newsUrls, ...eventsUrls, ...articlesUrls].join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
  console.log("✅ Sitemap обновлён!");
}

generateSitemap();
