interface NewsJsonLdParams {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
}

export function getNewsJsonLd({
  title,
  description = "",
  url,
  image,
  datePublished,
  authorName = "Мюнхенские Вести",
}: NewsJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    url: url,
    image: image ? [image] : undefined,
    datePublished: datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Мюнхенские Вести",
      url: "https://munchen-vesti.de",
      logo: {
        "@type": "ImageObject",
        url: "https://munchen-vesti.de/icons/logo.png",
      },
    }
  };
}
