import { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://munchen-vesti.de"; // замени на свой домен

const staticPages = [
  "",
  "/about",
  "/contacts",
  "/privacy-policy",
  "/impressum",
  "/articles-page",
  "/events-page",
  "/ads-food-page",
  "/ads-other-page",
  "/ads-services-page",
  "/ads-studios-page",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const urls = staticPages.map(
    (page) => `<url><loc>${baseUrl}${page}</loc><changefreq>weekly</changefreq></url>`
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();
}
