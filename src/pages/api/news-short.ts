import { getNewsByLocale } from "@/lib/getNews";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const locale = (req.query.locale as string) || "ru";
  const news = await getNewsByLocale(locale);
  res.status(200).json(news);
}
