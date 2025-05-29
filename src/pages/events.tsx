import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/Events.module.css";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useState } from "react";
// import EasterEggById from "@/components/EasterEggById";

interface EventsProps {
  events: Event[];
}

export default function Events({ events }: EventsProps) {
  const t = useTranslation();

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const months = [
    t("months.january"),
    t("months.february"),
    t("months.march"),
    t("months.april"),
    t("months.may"),
    t("months.june"),
    t("months.july"),
    t("months.august"),
    t("months.september"),
    t("months.october"),
    t("months.november"),
    t("months.december"),
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filteredEvents = selectedMonth
    ? events.filter((event) => {
        const eventDate = new Date(event.date!);
        return months[eventDate.getMonth()] === selectedMonth;
      })
    : events;

  return (
    <>
      <Seo title={t("meta.all_events_title")} description={t("meta.all_events_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.events_title")}</h1>
      <div className={styles.articleContainer}>
        <h2 className={styles.title}>{t("months.events_title")}</h2>
        <div className={styles.introBox}>
          <p className={styles.introText}>{t("months.introPart1")}</p>
          <p className={styles.introText}>{t("months.introPart2")}</p>
          <p className={styles.introText}>
            {t("months.introWithLink_part1")}
            <Link href="/articles-page" className={styles.inlineLink}>
              <span>{t("months.link_text")}</span>
            </Link>
            {t("months.introWithLink_part2")}
          </p>
          <p className={styles.introText4}>{t("months.introPart4")}</p>
        </div>
        <div className={styles.monthSelectContainer}>
          <label htmlFor="monthSelect">{t("months.filter_by_month")}</label>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={handleMonthChange}
            className={styles.monthSelect}
          >
            <option value="">{t("months.all_months")}</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.eventCardBox}>
          {filteredEvents.map((event, index) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className={`${styles.eventCard} ${index % 2 === 0 ? styles.evenCard : styles.oddCard}`}
            >
              <div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDetails}>
                  {event.time && ` ${event.time}`}
                  {event.ort && ` | ${event.ort}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.archiveLinkBox}>
          <Link href="/past-events-page" className={styles.archiveLink}>
            {t("buttons.past_events")}
          </Link>
        </div>
      </div>

      {/* <EasterEggById id="easteregg-events" chance={0.5} /> */}
    </>
  );
}
export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
  const allEvents = getEventsByLocale(locale || "ru");

  const now = new Date();
  now.setHours(0, 0, 0, 0); // обнуляем время, чтобы сравнивать только дату

  const filteredEvents = allEvents.filter((event) => {
    if (!event.date) return false;
    const startDate = new Date(event.date);
    return startDate >= now; // оставляем только будущие события
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    const startDateA = new Date(a.date || "").getTime();
    const startDateB = new Date(b.date || "").getTime();
    return startDateA - startDateB; // сортируем по дате возрастания
  });

  return {
    props: {
      events: sortedEvents,
    },
    revalidate: 43200, // например, чтобы обновлялось раз в 12 часов
  };
};

// export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
//   const allEvents = getEventsByLocale(locale || "ru");

//   const now = new Date();
//   now.setHours(0, 0, 0, 0);

//   const tenDaysLater = new Date(now);
//   tenDaysLater.setDate(tenDaysLater.getDate() + 20);

//   const filteredEvents = allEvents.filter((event) => {
//     if (!event.date) return false;
//     const startDate = new Date(event.date);
//     const endDate = event.endDate ? new Date(event.endDate) : startDate;
//     return (startDate >= now && startDate <= tenDaysLater) || (startDate <= now && endDate >= now);
//   });

//   const sortedEvents = filteredEvents.sort((a, b) => {
//     const startDateA = new Date(a.date || "").getTime();
//     const startDateB = new Date(b.date || "").getTime();
//     return startDateA - startDateB;
//   });

//   return {
//     props: {
//       events: sortedEvents,
//     },
//   };
// };
