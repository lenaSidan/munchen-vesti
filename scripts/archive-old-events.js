import fs from "fs";
import path from "path";

const eventsDir = path.join(process.cwd(), "public", "events");
const archiveDir = path.join(eventsDir, "arhiv");
const imagesDir = path.join(process.cwd(), "public", "images");

if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

const today = new Date();
today.setHours(0, 0, 0, 0);

fs.readdirSync(eventsDir).forEach((file) => {
  if (!file.endsWith(".md")) return;

  const filePath = path.join(eventsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  const dateMatch = content.match(/date:\s*(.+)/);
  const endDateMatch = content.match(/endDate:\s*(.+)/);
  const imageMatch = content.match(/image:\s*(.+)/);

  const startDate = dateMatch ? new Date(dateMatch[1]) : null;
  const endDate = endDateMatch ? new Date(endDateMatch[1]) : startDate;

  if (!startDate || !endDate || endDate >= today) return;

  // Удаление изображения, если указано
  if (imageMatch) {
    const imagePath = path.join(imagesDir, imageMatch[1].trim().replace(/^\/images\//, ""));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`🖼️ Удалено изображение: ${imageMatch[1].trim()}`);
    }
  }

  // Перемещаем файл в архив
  fs.renameSync(filePath, path.join(archiveDir, file));
  console.log(`🗃️ Перемещено: ${file}`);
});