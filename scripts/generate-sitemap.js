// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const baseUrl = "https://munchen-vesti.de";

// 📄 Статические пути
const staticPaths = [
  "",
  "/about",
  "/contacts",
  "/privacy-policy",
  "/impressum",
  "/articles-page",
  "/events-page",
  "/gastronomy-page",
  "/other-page", 
  "/services-page", 
  "/education-page"
];

// 🧠 Хелперы для динамических путей
function getSlugsFromDirectory(dir, localeExt) {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  return files
    .filter((file) => file.endsWith(localeExt))
    .map((file) => file.replace(localeExt, ""));
}

// 📰 Динамические статьи
const articlesRu = getSlugsFromDirectory("public/articles_summaries", ".ru.md").map(
  (slug) => `/articles/${slug}`
);
const articlesDe = getSlugsFromDirectory("public/articles_summaries", ".de.md").map(
  (slug) => `/de/articles/${slug}`
);

// 🎉 Динамические события
const eventsRu = getSlugsFromDirectory("public/events", ".ru.md").map(
  (slug) => `/events/${slug}`
);
const eventsDe = getSlugsFromDirectory("public/events", ".de.md").map(
  (slug) => `/de/events/${slug}`
);

// 🌐 Финальный список всех путей
const allPaths = [
  ...staticPaths,
  ...articlesRu,
  ...articlesDe,
  ...eventsRu,
  ...eventsDe,
];

// 🧩 Создаём строки XML
const urls = allPaths.map(
  (url) =>
    `<url><loc>${baseUrl}${url}</loc><changefreq>weekly</changefreq></url>`
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

// 💾 Записываем sitemap.xml
fs.writeFileSync(path.join("public", "sitemap.xml"), sitemap);
console.log("✅ sitemap.xml сгенерирован");