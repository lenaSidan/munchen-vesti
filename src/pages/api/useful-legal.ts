import type { NextApiRequest, NextApiResponse } from "next";
import { getUsefulByLocale, UsefulItem } from "@/lib/getUseful";

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { locale = "ru", limit = "1" } = req.query;

    // 🔹 Загружаем ВСЕ статьи /useful
    const allItems: UsefulItem[] = await getUsefulByLocale(locale as string);

    // 🔹 Никакой фильтрации — берём весь список
    const legalItems = allItems;

    const n = Number(limit) || 1;

    const shuffled = shuffle(legalItems).slice(0, n);

    res.status(200).json(shuffled);
  } catch (e) {
    console.error("Error in /api/useful-legal:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}