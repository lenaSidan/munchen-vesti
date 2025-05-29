const fs = require("fs");
const path = require("path");

const eventsDir = path.join(process.cwd(), "public", "events");
const archiveDir = path.join(eventsDir, "arhiv");

const imagesDir = path.join(process.cwd(), "public", "images");
const archiveImagesDir = path.join(imagesDir, "arhivImages");

// Создаём архивные папки при необходимости
if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
if (!fs.existsSync(archiveImagesDir)) fs.mkdirSync(archiveImagesDir, { recursive: true });

const today = new Date();
today.setHours(0, 0, 0, 0);

const localeMdPattern = /\.(ru|de)\.md$/;

fs.readdirSync(eventsDir).forEach((file) => {
  if (!localeMdPattern.test(file)) return;

  const filePath = path.join(eventsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  const dateMatch = content.match(/date:\s*(.+)/);
  const endDateMatch = content.match(/endDate:\s*(.+)/);
  const imageMatch = content.match(/image:\s*["']?(\/?images\/([a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg)))["']?/);

  const startDate = dateMatch ? new Date(dateMatch[1]) : null;
  const endDate = endDateMatch ? new Date(endDateMatch[1]) : startDate;

  if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
    console.warn(`⚠️ Пропущено (неверная дата): ${file}`);
    return;
  }

  if (endDate >= today) return;

  // Перемещаем md-файл
  try {
    fs.renameSync(filePath, path.join(archiveDir, file));
    console.log(`🗃️ Перемещено: ${file}`);
  } catch (err) {
    console.error(`❌ Ошибка при перемещении ${file}:`, err);
  }

  // Перемещаем картинку, если указана
  if (imageMatch) {
    const imageFilename = imageMatch[2];
    const srcImagePath = path.join(imagesDir, imageFilename);
    const destImagePath = path.join(archiveImagesDir, imageFilename);

    if (fs.existsSync(srcImagePath)) {
      try {
        fs.renameSync(srcImagePath, destImagePath);
        console.log(`🖼️ Изображение перенесено: ${imageFilename}`);
      } catch (err) {
        console.error(`❌ Ошибка при переносе изображения ${imageFilename}:`, err);
      }
    }
  }
});
