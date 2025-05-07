import fs from "fs";
import path from "path";
import matter from "gray-matter";

const EVENTS_DIR = path.join(process.cwd(), "public", "events");
const ARCHIVE_DIR = path.join(EVENTS_DIR, "arhiv");

const checkFields = [
  "title",
  "date",
  "endDate",
  "time",
  "seoTitle",
  "seoDescription",
];

function getAllFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((file) => file.endsWith(".md"));
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(content);

  const errors = [];

  checkFields.forEach((key) => {
    const value = data[key];
    if (value !== undefined && typeof value !== "string") {
      errors.push(`❌ ${key} is not a string (type: ${typeof value})`);
    }
  });

  return errors;
}

function checkAll(directory, label) {
  const files = getAllFiles(directory);
  console.log(`📁 Checking ${label} (${files.length} files)...`);

  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const errors = checkFile(fullPath);
    if (errors.length > 0) {
      console.log(`\n🔍 File: ${file}`);
      errors.forEach((err) => console.log("  " + err));
    }
  });
}

// 🚀 Запуск
checkAll(EVENTS_DIR, "events");
checkAll(ARCHIVE_DIR, "archive");

// node checkEventFields.js
