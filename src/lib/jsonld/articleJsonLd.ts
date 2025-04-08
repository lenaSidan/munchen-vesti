interface ArticleJsonLdParams {
  title: string;
  description?: string;
  url: string;
  image: string;
  author?: string;
}

export function getArticleJsonLd({
  title,
  description = "",
  url,
  image,
  author,
}: ArticleJsonLdParams) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [image],
    publisher: {
      "@type": "Organization",
      name: "Мюнхенские Вести",
      logo: {
        "@type": "ImageObject",
        url: "https://munchen-vesti.de/favicon.ico",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (author) {
    jsonLd.author = {
      "@type": "Person",
      name: author,
    };
  }

  return jsonLd;
}