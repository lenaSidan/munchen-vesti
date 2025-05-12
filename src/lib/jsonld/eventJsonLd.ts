interface EventJsonLdParams {
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  time?: string;
  image: string;
  ort: string;
}

function parseTimeRange(time?: string): { startTime: string; endTime: string } {
  if (!time) return { startTime: "10:00", endTime: "20:00" };

  const timeMatch = time.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (timeMatch) {
    return { startTime: timeMatch[1], endTime: timeMatch[2] };
  }

  return { startTime: "10:00", endTime: "20:00" };
}

function toISODateTime(date: string, time: string): string {
  const [year, month, day] = date.split("-");
  return `${year}-${month}-${day}T${time}:00+02:00`;
}

export function getEventJsonLd({
  title,
  description = "",
  date,
  endDate,
  time,
  image,
  ort,
}: EventJsonLdParams): Record<string, unknown> {
  const { startTime, endTime } = parseTimeRange(time);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description,
    startDate: toISODateTime(date, startTime),
    endDate: toISODateTime(endDate || date, endTime),
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
    image: [image.startsWith("http") ? image : `https://munchen-vesti.de${image}`],
    organizer: {
      "@type": "Organization",
      name: "Мюнхенские Вѣсти",
      url: "https://munchen-vesti.de",
    },
  };
}
