// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const baseDir = process.cwd();
const imagesDir = path.join(baseDir, "public", "images");
const outputLog = path.join(baseDir, "log", "unused-images.txt");
const codeDirs = ["src", "public"];
const validExtensions = [".md", ".ts", ".tsx"];
const imagePattern = /\/images\/([a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg))/g;

function findAllUsedImages() {
  const used = new Set();

  const scanDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (validExtensions.some((ext) => entry.name.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const matches = content.match(imagePattern);
        if (matches) {
          matches.forEach((m) => used.add(m.replace("/images/", "").trim()));
        }
      }
    }
  };

  codeDirs.forEach((dir) => scanDir(path.join(baseDir, dir)));
  return used;
}

function findUnusedImages() {
  if (!fs.existsSync(imagesDir)) return [];

  const usedImages = findAllUsedImages();
  const allImages = fs.readdirSync(imagesDir);
  return allImages.filter((img) => !usedImages.has(img));
}

function runCleanup() {
  console.log("🔎 Поиск неиспользуемых изображений...");

  const unused = findUnusedImages();
  if (unused.length === 0) {
    console.log("✅ Все изображения используются.");
    return;
  }

  const output = unused.map((img) => `/public/images/${img}`).join("\n");
  fs.mkdirSync(path.dirname(outputLog), { recursive: true });
  fs.writeFileSync(outputLog, output);
  console.log(`📁 Найдено ${unused.length} неиспользуемых изображений. Сохранено в ${outputLog}`);
}

runCleanup();
