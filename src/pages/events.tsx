import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/Events.module.css";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

// import EasterEggById from "@/components/EasterEggById";

interface EventsProps {
  events: Event[];
}

export default function Events({ events }: EventsProps) {
  const t = useTranslation();

  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("");
  // const monthYearOptions = useMemo(() => {
  //   const optionsSet = new Set<string>();
  //   const optionsList: { value: string; label: string }[] = [];

  //   events.forEach((event) => {
  //     if (!event.date) return;
  //     const date = new Date(event.date);
  //     const year = date.getFullYear();
  //     const monthIndex = date.getMonth();
  //     const monthName = t(`months.${date.toLocaleString("en", { month: "long" }).toLowerCase()}`);
  //     const value = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  //     if (!optionsSet.has(value)) {
  //       optionsSet.add(value);
  //       optionsList.push({ value, label: `${monthName} ${year}` });
  //     }
  //   });

  //   return optionsList;
  // }, [events, t]);
  const monthYearOptions = useMemo(() => {
    const now = new Date();
    now.setDate(1); // текущий месяц без учёта дней

    const optionsSet = new Set<string>();
    const optionsList: { value: string; label: string }[] = [];

    events.forEach((event) => {
      if (!event.date) return;

      const startDate = new Date(event.date);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;

      const current = new Date(startDate);
      current.setDate(1); // нормализуем до первого числа месяца

      while (
        current.getFullYear() < endDate.getFullYear() ||
        (current.getFullYear() === endDate.getFullYear() &&
          current.getMonth() <= endDate.getMonth())
      ) {
        // Проверка: если месяц уже полностью прошёл — пропускаем
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0); // конец месяца
        if (monthEnd < now) {
          current.setMonth(current.getMonth() + 1);
          continue;
        }

        const year = current.getFullYear();
        const monthIndex = current.getMonth();
        const monthName = t(
          `months.${current.toLocaleString("en", { month: "long" }).toLowerCase()}`
        );
        const value = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

        if (!optionsSet.has(value)) {
          optionsSet.add(value);
          optionsList.push({ value, label: `${monthName} ${year}` });
        }

        current.setMonth(current.getMonth() + 1);
      }
    });

    return optionsList.sort((a, b) => a.value.localeCompare(b.value));
  }, [events, t]);

  useEffect(() => {
    if (!selectedMonthYear && monthYearOptions.length > 0) {
      const now = new Date();
      const currentMonthValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const hasCurrent = monthYearOptions.find((opt) => opt.value === currentMonthValue);
      setSelectedMonthYear(hasCurrent?.value || monthYearOptions[0].value);
    }
  }, [monthYearOptions, selectedMonthYear]);

  // const filteredEvents = useMemo(() => {
  //   if (!selectedMonthYear) return [];
  //   const [year, month] = selectedMonthYear.split("-").map(Number);
  //   return events.filter((event) => {
  //     if (!event.date) return false;
  //     const date = new Date(event.date);
  //     return date.getFullYear() === year && date.getMonth() + 1 === month;
  //   });
  // }, [selectedMonthYear, events]);
  const filteredEvents = useMemo(() => {
    if (!selectedMonthYear) return [];
    const [year, month] = selectedMonthYear.split("-").map(Number);

    return events.filter((event) => {
      if (!event.date) return false;

      const startDate = new Date(event.date);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;

      const eventStartMonth = startDate.getMonth() + 1;
      const eventStartYear = startDate.getFullYear();

      const eventEndMonth = endDate.getMonth() + 1;
      const eventEndYear = endDate.getFullYear();

      // Событие попадает в выбранный месяц, если:
      // - выбранный месяц/год находится внутри диапазона от start до end
      const eventStartsBeforeOrInMonth =
        eventStartYear < year || (eventStartYear === year && eventStartMonth <= month);
      const eventEndsAfterOrInMonth =
        eventEndYear > year || (eventEndYear === year && eventEndMonth >= month);

      return eventStartsBeforeOrInMonth && eventEndsAfterOrInMonth;
    });
  }, [selectedMonthYear, events]);

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
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className={styles.monthSelect}
          >
            {monthYearOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.eventCardBox}>
          {filteredEvents.map((event, index) => (
            <Link
              key={Array.isArray(event.slug) ? event.slug.join("-") : event.slug}
              href={`/events-page#${Array.isArray(event.fileId) ? event.fileId[0] : event.fileId}`}
              className={`${styles.eventCard} ${index % 2 === 0 ? styles.evenCard : styles.oddCard}`}
            >
              <div className={styles.imageTitleBox}>
                {event.image && (
                  <Image
                    src={event.image}
                    alt={event.imageAlt || event.title}
                    className={styles.eventImage}
                    width={150}
                    height={85}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                )}
                <div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDetails}>
                    {event.time && ` ${event.time}`}
                    {event.ort && ` | ${event.ort}`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.archiveLinkBox}>
          <Link href="/past-events-page" className={styles.archiveButton}>
            {t("buttons.past_events")}
          </Link>
        </div>
      </div>
      <SubscribeBox />
      {/* <EasterEggById id="easteregg-events" chance={0.5} /> */}
    </>
  );
}
async function processMarkdown(content: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}

export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
  const rawEvents = getEventsByLocale(locale || "ru");
  const now = new Date();

  const activeEvents = rawEvents.filter((event) => {
    if (!event.date) return false;
    const start = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : start;
    return end >= now; // теперь корректно удаляет события с прошлой даты
  });

  const sortedEvents = activeEvents.sort(
    (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
  );

  const events = await Promise.all(
    sortedEvents.map(async (event) => ({
      ...event,
      content: await processMarkdown(event.content),
    }))
  );

  return {
    props: { events },
    revalidate: 43200,
  };
};
