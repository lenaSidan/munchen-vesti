export function formatHumanDate(date: string, locale: string): string {
  const formatted = new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const cleaned = formatted.replace(/ г\.?$/, "");

  return locale === "ru" ? `${cleaned} года` : formatted;
}
