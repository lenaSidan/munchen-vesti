const fs = require("fs");
const path = require("path");

const baseUrl = "https://munchen-vesti.de";
const publicDir = path.join(process.cwd(), "public");

// 🧹 Очистка старых sitemap-файлов
function cleanupOldSitemaps() {
  const files = fs.readdirSync(publicDir);
  const sitemapFiles = files.filter((f) => f.endsWith("sitemap.xml") || f.endsWith("-sitemap.xml"));
  for (const file of sitemapFiles) {
    fs.unlinkSync(path.join(publicDir, file));
  }
  console.log(`🧹 Удалено старых sitemap-файлов: ${sitemapFiles.length}`);
}

// 📄 Генерация URL из Markdown (с поддержкой вложенных папок)
function getMarkdownUrls(
  folder,
  prefix,
  checkEventDates = false,
  priority = "0.6",
  changefreq = "weekly"
) {
  const dirPath = path.join(publicDir, folder);
  if (!fs.existsSync(dirPath)) return [];

  const urls = [];

  function walkDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const stats = fs.statSync(fullPath);
        const lastmod = stats.mtime.toISOString().split("T")[0];
        const [filename, locale] = entry.name.replace(".md", "").split(".");
        const slug = filename.replace(/^\d{2}-\d{2}-\d{4}-/, "");
        const localePrefix = locale === "de" ? "/de" : "";
        const relativeDir = path.relative(dirPath, currentPath).replace(/\\/g, "/");
        const subPath = relativeDir ? `/${relativeDir}` : "";

        const content = fs.readFileSync(fullPath, "utf-8");
        if (checkEventDates) {
          const dateMatch = content.match(/date:\s*(.+)/);
          const endDateMatch = content.match(/endDate:\s*(.+)/);
          const startDate = dateMatch ? new Date(dateMatch[1]) : null;
          const endDate = endDateMatch ? new Date(endDateMatch[1]) : startDate;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (!startDate || endDate < today) continue;
        }

        urls.push(`<url>
  <loc>${baseUrl}${localePrefix}/${prefix}${subPath}/${slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`);
      }
    }
  }

  walkDir(dirPath);
  return urls;
}


// 🧾 Запись отдельных sitemap
function writeSitemap(filename, urls) {
  if (!urls.length) {
    console.log(`⚪ Пропущен ${filename} (нет URL)`);
    return;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, filename), xml);
  console.log(`✅ ${filename} создан (${urls.length} URL)`);
}
// 🗺 Генерация ссылок для раздела Places (вложенные категории)
function getPlacesUrls() {
  const placesDir = path.join(publicDir, "places");
  if (!fs.existsSync(placesDir)) return [];

  const urls = [];
  const categories = fs.readdirSync(placesDir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const category of categories) {
    const categoryPath = path.join(placesDir, category.name);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const stats = fs.statSync(filePath);
      const lastmod = stats.mtime.toISOString().split("T")[0];
      const [filename, locale] = file.replace(".md", "").split(".");
      const slug = filename.replace(/^\d{2}-\d{2}-\d{4}-/, "");
      const localePrefix = locale === "de" ? "/de" : "";
      urls.push(`<url>
  <loc>${baseUrl}${localePrefix}/places/${category.name}/${slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`);
    }
  }

  return urls;
}

// 🧩 Генерация всех карт сайта
function generateAll() {
  cleanupOldSitemaps();

  const articles = getMarkdownUrls("articles", "articles", false, "0.7");
  const news = getMarkdownUrls("news", "news", false, "0.6");
  const events = getMarkdownUrls("events", "events", true, "0.9");
  const pastEvents = getMarkdownUrls("events/arhiv", "past-events", false, "0.3", "monthly");
  const places = getPlacesUrls();
  const postcards = getMarkdownUrls("postcards-md", "postcards", false, "0.6");
  const useful = getMarkdownUrls("useful", "useful", false, "0.6");

  writeSitemap("articles-sitemap.xml", articles);
  writeSitemap("news-sitemap.xml", news);
  writeSitemap("events-sitemap.xml", events);
  writeSitemap("past-events-sitemap.xml", pastEvents);
  writeSitemap("places-sitemap.xml", places);
  writeSitemap("postcards-sitemap.xml", postcards);
  writeSitemap("useful-sitemap.xml", useful);

  const today = new Date().toISOString().split("T")[0];
  const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${baseUrl}/articles-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/news-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/events-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/past-events-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/places-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/postcards-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/useful-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, "sitemap-index.xml"), index);
  console.log("📘 sitemap-index.xml обновлён!");
}


// 🚀 Запуск
generateAll();
