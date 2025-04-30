// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const baseUrl = "https://munchen-vesti.de";
const pagesDir = path.join(process.cwd(), "src/pages");

const excludeFiles = ["_app.tsx", "_document.tsx", "_error.tsx", "404.tsx", "500.tsx"];
const excludeDirs = ["api", "components"];

// Рекурсивно обходит все страницы и возвращает относительные пути
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        walkDir(filePath, fileList);
      }
    } else if (
      file.endsWith(".tsx") &&
      !excludeFiles.includes(file) &&
      !file.startsWith("[")
    ) {
      const relativePath = path.relative(pagesDir, filePath).replace(/\\/g, "/");
      fileList.push(relativePath);
    }
  });
  return fileList;
}

function getStaticPages() {
  const pageFiles = walkDir(pagesDir);

  return pageFiles.map((relativePath) => {
    let urlPath = relativePath
      .replace(/\.tsx$/, "") // удалить расширение
      .replace(/\/index$/, "") // удалить trailing index
      .replace("-page", ""); // при необходимости можно убрать суффикс

    return `<url><loc>${baseUrl}/${urlPath}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`;
  });
}

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
  const staticUrls = [
    `<url><loc>${baseUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`
  ];

  const dynamicPages = getStaticPages();
  const newsUrls = getMarkdownUrls("news", "news", false, "0.6");
  const articlesUrls = getMarkdownUrls("articles", "articles", false, "0.7");
  const eventsUrls = getMarkdownUrls("events", "events", true, "0.9");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...dynamicPages, ...newsUrls, ...eventsUrls, ...articlesUrls].join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
  console.log("✅ Sitemap обновлён!");
}

generateSitemap();
