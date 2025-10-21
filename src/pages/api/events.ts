import type { NextApiRequest, NextApiResponse } from "next";
import { getEventsByLocale } from "@/lib/getEvents"; // если алиасов нет, замени на "../../lib/getEvents"

type Data =
  | { count: number; items: any[] }
  | { error: string };

/**
 * GET /api/events?lang=ru&period=week&limit=10
 * period: "week" | "month" | "all" (по умолчанию: week)
 * lang: "ru" | "de" | и т.п. (по умолчанию: ru)
 * limit: число (по умолчанию: 10, 0 — без ограничения)
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const lang = (req.query.lang as string) || "ru";
    const period = (req.query.period as string) || "week";
    const limitRaw = req.query.limit as string | undefined;
    const limit = limitRaw ? Math.max(0, Number(limitRaw)) : 10;

    // все будущие/текущие события (твоя функция уже возвращает отсортированный список)
    const all = getEventsByLocale(lang);

    const now = new Date();
    const end = new Date();

    if (period === "week") {
      end.setDate(now.getDate() + 7);
    } else if (period === "month") {
      end.setMonth(now.getMonth() + 1);
    } else if (period === "all") {
      // берём как есть (все будущие события)
      // ничего не меняем
    } else {
      return res
        .status(400)
        .json({ error: 'Неверный параметр "period". Используйте week | month | all.' });
    }

    // фильтруем по периоду, если не "all"
    const filtered =
      period === "all"
        ? all
        : all.filter((e) => {
            const d = new Date(e.date!);
            return d >= now && d <= end;
          });

    // отдаем только нужные поля (без content, чтобы не нагружать ответ)
    const items = filtered.map((e) => ({
      title: e.title,
      shortTitle: e.shortTitle ?? e.title,
      date: e.date ?? null,
      endDate: e.endDate ?? null,
      time: e.time ?? null,
      ort: e.ort ?? null,
      link: e.link ?? null,
      image: e.image ?? null,
      slug: e.slug,       // массив с вариантами слага
      fileId: e.fileId,   // пригодится, если нужно делать deeplink
    }));

    const limited = limit > 0 ? items.slice(0, limit) : items;

    res.status(200).json({ count: limited.length, items: limited });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
