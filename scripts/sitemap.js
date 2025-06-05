const fs = require("fs");
const path = require("path");

const baseUrl = "https://munchen-vesti.de";
const pagesDir = path.join(process.cwd(), "src/pages");

const excludeFiles = ["_app.tsx", "_document.tsx", "_error.tsx", "404.tsx", "500.tsx"];
const excludeDirs = ["api", "components"];
const excludeCustomPaths = ["article-muenchen", "nachrichten-muenchen", "veranstaltungen-muenchen"];

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith(".tsx") && !excludeFiles.includes(file) && !file.startsWith("[")) {
      const relativePath = path.relative(pagesDir, filePath).replace(/\\/g, "/").trim();
      fileList.push(relativePath);
    }
  }
  return fileList;
}

function getStaticPages() {
  const allFiles = walkDir(pagesDir);

  const filteredFiles = allFiles.filter((relativePath) => {
    return !excludeCustomPaths.some((excluded) =>
      relativePath.replace(".tsx", "").endsWith(excluded)
    );
  });

  return filteredFiles.map((relativePath) => {
    const pagePath = relativePath.replace(".tsx", "").replace(/\/index$/, "");
    const urlPath = pagePath === "index" ? "" : pagePath;
    return `<url><loc>${baseUrl}/${urlPath}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`;
  });
}

function getMarkdownUrls(folder, prefix, checkEventDates = false, priority = "0.6") {
  const dirPath = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);

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

// 🔹 Новая функция для прошедших событий
function getArchivedEventUrls() {
  return getMarkdownUrls("events/arhiv", "events", false, "0.3");
}

function generateSitemap() {
  const staticUrls = [
    `<url><loc>${baseUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${baseUrl}/past-events-page</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>`,
  ];

  const dynamicPages = getStaticPages();
  const newsUrls = getMarkdownUrls("news", "news", false, "0.6");
  const articlesUrls = getMarkdownUrls("articles", "articles", false, "0.7");
  const eventsUrls = getMarkdownUrls("events", "events", true, "0.9");
  const geocachingUrls = getMarkdownUrls("geocaching", "geocaching", false, "0.6");
  const articleSummariesUrls = getMarkdownUrls(
    "articles_summaries",
    "articles_summaries",
    false,
    "0.5"
  );
  const postcardUrls = getMarkdownUrls("postcards", "postcards", false, "0.5");

  const archivedEvents = getArchivedEventUrls();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  ...staticUrls,
  ...dynamicPages,
  ...newsUrls,
  ...eventsUrls,
  ...archivedEvents,
  ...articlesUrls,
  ...geocachingUrls,
  ...articleSummariesUrls,
  ...postcardUrls,
].join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
  console.log("✅ Sitemap обновлён!");
}

generateSitemap();
