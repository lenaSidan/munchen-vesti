import type { NextApiRequest, NextApiResponse } from "next";
import { getAllSearchableItems } from "@/lib/getAllContent";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const locale = (req.query.locale as string) || "ru";
  const items = getAllSearchableItems(locale);

  // Убираем дубли
const unique = Array.from(new Map(items.map((i) => [i.fileId, i])).values());

  res.status(200).json(unique);
}
