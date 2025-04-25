import Head from "next/head";

interface PageHeadProps {
  title: string;
  description: string;
  url: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

export default function PageHead({
  title,
  description,
  url,
  ogImage = "https://munchen-vesti.de/default-og-image.png",
  jsonLd,
}: PageHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <link rel="canonical" href={url} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
