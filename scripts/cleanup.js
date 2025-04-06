import fs from "fs";
import path from "path";

const baseDir = process.cwd();
const imagesDir = path.join(baseDir, "public", "images");
const logPath = path.join(baseDir, "cleanup-log.txt");
const markdownDirs = ["public/events", "public/news", "public/articles"];
const codeDirs = ["src", "public"];
const validExtensions = [".md", ".ts", ".tsx"];
const imagePattern = /\/images\/([a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg))/g;

// Логгер
function log(message) {
  console.log(message);
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
}

// 1. Очистка image: у прошедших событий (оставляя .md-файл)
function cleanOldMarkdownImages() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  markdownDirs.forEach((folder) => {
    const dirPath = path.join(baseDir, folder);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const content = fs.readFileSync(fullPath, "utf-8");

      const dateMatch = content.match(/date:\s*(.+)/);
      const date = dateMatch ? new Date(dateMatch[1]) : null;

      if (date && date < now && folder.includes("events")) {
        const cleaned = content
          .replace(/^image:.*$/gm, "")
          .replace(/^imageAlt:.*$/gm, "");

        fs.writeFileSync(fullPath, cleaned.trim() + "\n");
        log(`📝 Очистка изображения в прошедшем событии: ${file}`);
      }
    }
  });
}

// 2. Поиск и удаление неиспользуемых изображений
function findAllUsedImages() {
  const used = new Set();

  const scanDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(entryPath);
      } else if (validExtensions.some((ext) => entry.name.endsWith(ext))) {
        const content = fs.readFileSync(entryPath, "utf-8");
        const matches = content.match(imagePattern);
        if (matches) {
          matches.forEach((m) => used.add(m.replace("/images/", "").trim()));
        }
      }
    }
  };

  codeDirs.forEach((d) => scanDir(path.join(baseDir, d)));
  return used;
}

function deleteUnusedImages() {
  if (!fs.existsSync(imagesDir)) return;

  const used = findAllUsedImages();
  const images = fs.readdirSync(imagesDir);

  let count = 0;
  images.forEach((img) => {
    if (!used.has(img)) {
      fs.unlinkSync(path.join(imagesDir, img));
      log(`🗑️ Удалено неиспользуемое изображение: ${img}`);
      count++;
    }
  });

  if (count === 0) {
    log("✅ Все изображения используются.");
  } else {
    log(`🎉 Удалено ${count} изображений.`);
  }
}

// Запуск
function runCleanup() {
  log("🚀 Запуск очистки...");
  cleanOldMarkdownImages();
  deleteUnusedImages();
  log("✅ Очистка завершена.\n");
}

runCleanup();
