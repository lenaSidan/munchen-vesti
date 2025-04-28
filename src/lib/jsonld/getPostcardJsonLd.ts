interface PostcardJsonLdParams {
  title: string;
  description?: string;
  url: string;
  image?: string;
}

export function getPostcardJsonLd({
  title,
  description = "",
  url,
  image,
}: PostcardJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork", // Для открыток лучше подходит CreativeWork
    headline: title,
    description: description,
    url: url,
    image: image ? [image] : undefined,
    creator: {
      "@type": "Organization",
      name: "Мюнхенские Вести",
      url: "https://munchen-vesti.de",
      logo: {
        "@type": "ImageObject",
        url: "https://munchen-vesti.de/icons/logo.png",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Мюнхенские Вести",
      url: "https://munchen-vesti.de",
    },
  };
}
