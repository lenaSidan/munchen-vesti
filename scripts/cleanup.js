const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const baseDir = process.cwd();
const imagesDir = path.join(baseDir, "public", "images");
const outputLog = path.join(baseDir, "log", "unused-images.txt");
const codeDirs = ["src", "public"];
const validExtensions = [".md", ".ts", ".tsx"];
const imagePattern = /\/images\/([a-zA-Z0-9._-]+\.webp)/g; // 💡 Только .webp

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

        // .md → разбираем frontmatter (image: ...)
        if (entry.name.endsWith(".md")) {
          const parsed = matter(content);
          const imageField = parsed.data?.image;
          if (imageField && typeof imageField === "string" && imageField.endsWith(".webp")) {
            const imageName = path.basename(imageField);
            used.add(imageName);
          }
        }

        // Все /images/*.webp из обычного текста
        const matches = content.match(imagePattern);
        if (matches) {
          matches.forEach((m) => {
            const file = m.replace("/images/", "").trim();
            used.add(file);
          });
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
  const allImages = fs.readdirSync(imagesDir).filter((img) =>
    img.endsWith(".webp") && fs.statSync(path.join(imagesDir, img)).isFile()
  );

  return allImages.filter((img) => !usedImages.has(img));
}

function runCleanup() {
  console.log("🔎 Поиск неиспользуемых .webp изображений...");

  const unused = findUnusedImages();
  if (unused.length === 0) {
    console.log("✅ Все .webp изображения используются.");
    return;
  }

  const output = unused.map((img) => `/public/images/${img}`).join("\n");
  fs.mkdirSync(path.dirname(outputLog), { recursive: true });
  fs.writeFileSync(outputLog, output);
  console.log(`📁 Найдено ${unused.length} неиспользуемых .webp изображений. Сохранено в ${outputLog}`);
}

runCleanup();
