import type { NextApiRequest, NextApiResponse } from "next";
import { getNewsByLocale } from "@/lib/getNewsByLocale";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const locale = req.query.locale as string || "ru";
  const news = await getNewsByLocale(locale);
  res.status(200).json(news);
}
