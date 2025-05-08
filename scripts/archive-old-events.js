const fs = require("fs");
const path = require("path");

const eventsDir = path.join(process.cwd(), "public", "events");
const archiveDir = path.join(eventsDir, "arhiv");

if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir);

const today = new Date();
today.setHours(0, 0, 0, 0);

fs.readdirSync(eventsDir).forEach((file) => {
  if (!file.endsWith(".md")) return;

  const filePath = path.join(eventsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  const dateMatch = content.match(/date:\s*(.+)/);
  const endDateMatch = content.match(/endDate:\s*(.+)/);

  const startDate = dateMatch ? new Date(dateMatch[1]) : null;
  const endDate = endDateMatch ? new Date(endDateMatch[1]) : startDate;

  if (!startDate || !endDate || endDate >= today) return;

  fs.renameSync(filePath, path.join(archiveDir, file));
  console.log(`🗃️ Перемещено: ${file}`);
});
