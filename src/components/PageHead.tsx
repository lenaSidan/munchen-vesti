import Head from "next/head";

interface PageHeadProps {
  title: string;
  description: string;
  url: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
  archived?: boolean; // 👈 добавили флаг
  canonicalOriginal?: string; // 👈 ссылка на оригинальную страницу (если архив)
}

export default function PageHead({
  title,
  description,
  url,
  ogImage = "https://munchen-vesti.de/default-og-image.png",
  jsonLd,
  archived = false,
  canonicalOriginal,
}: PageHeadProps) {
  // если это архивная страница — canonical указывает на оригинал
  const canonicalUrl = archived && canonicalOriginal ? canonicalOriginal : url;

  // если это архивная страница — запрещаем индексацию
  const robotsContent = archived ? "noindex, follow" : "index, follow";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <link rel="canonical" href={canonicalUrl} />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
