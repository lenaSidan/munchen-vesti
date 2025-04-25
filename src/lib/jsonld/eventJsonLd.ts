interface EventJsonLdParams {
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  image: string;
  ort: string;
}

export function getEventJsonLd({
  title,
  description = "",
  date,
  endDate,
  image,
  ort,
}: EventJsonLdParams): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description,
    startDate: date,
    endDate: endDate || date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: ort,
      address: {
        "@type": "PostalAddress",
        addressLocality: "München",
        streetAddress: ort,
      },
    },
    image: [image.startsWith('http') ? image : `https://munchen-vesti.de${image}`],
    organizer: {
      "@type": "Organization",
      name: "Мюнхенские Вести",
      url: "https://munchen-vesti.de",
    },
  };
}
