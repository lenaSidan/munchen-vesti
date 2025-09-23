import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/EventsPageNew.module.css";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface EventsProps {
  events: Event[];
}

export default function EventsPage({ events }: EventsProps) {
  const t = useTranslation();
  const router = useRouter();

  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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
        // Если месяц уже полностью прошёл — пропускаем
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
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

  // Авто-выбор текущего месяца, НО не мешаем, если пришли с hash
  useEffect(() => {
    if (!selectedMonthYear && monthYearOptions.length > 0) {
      if (typeof window !== "undefined" && window.location.hash) return; // пусть выберет другой эффект
      const now = new Date();
      const currentMonthValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const hasCurrent = monthYearOptions.find((opt) => opt.value === currentMonthValue);
      setSelectedMonthYear(hasCurrent?.value || monthYearOptions[0].value);
    }
  }, [monthYearOptions, selectedMonthYear]);

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

      const eventStartsBeforeOrInMonth =
        eventStartYear < year || (eventStartYear === year && eventStartMonth <= month);
      const eventEndsAfterOrInMonth =
        eventEndYear > year || (eventEndYear === year && eventEndMonth >= month);

      return eventStartsBeforeOrInMonth && eventEndsAfterOrInMonth;
    });
  }, [selectedMonthYear, events]);

  const handleDownloadICS = useCallback(async (event: Event) => {
    if (!event.date) return;
    const start = new Date(event.date);
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(start.getTime() + 60 * 60 * 1000);

    const url = `/api/ics?title=${encodeURIComponent(event.title)}&description=${encodeURIComponent(event.content || "")}&location=${encodeURIComponent(event.ort || "")}&start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(endDate.toISOString())}`;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${event.slug || "event"}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed", err);
    }
  }, []);

  const formatDateForGoogle = (start: string, end?: string) => {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date(s.getTime() + 60 * 60 * 1000);
    const f = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")
        .slice(0, 15) + "Z";
    return `${f(s)}/${f(e)}`;
  };

  const getExcerpt = (html: string) => {
    if (typeof window === "undefined") return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.querySelector("p")?.outerHTML || html;
  };

  /** 1) Если есть hash — выбираем месяц события по его slug */
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash || !events?.length) return;

    const raw = window.location.hash.slice(1);
    const slug = decodeURIComponent(raw);
    const ev = events.find((e) => e.slug === slug);
    if (!ev?.date) return;

    const d = new Date(ev.date);
    const target = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (selectedMonthYear !== target) {
      setSelectedMonthYear(target);
    }
  }, [events]); // срабатывает при первом появлении events

  /** 2) После выбора нужного месяца — скроллим к карточке */
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;

    const raw = window.location.hash.slice(1);
    const decoded = decodeURIComponent(raw);

    const id = requestAnimationFrame(() => {
      const el = document.getElementById(decoded) || document.getElementById(raw);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setExpandedSlug(decoded);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [selectedMonthYear, filteredEvents]);

  //   function renderSimpleLinks(input: string, classNameLink?: string, classNameText?: string) {
  //   if (!input) return null;

  //   const trimmed = input.trim();

  //   // Проверка: есть ли | и валидная ссылка после
  //   if (trimmed.includes("|")) {
  //     const [text, href] = trimmed.split("|").map((s) => s.trim());

  //     if (href && href.startsWith("http")) {
  //       return (
  //         <a
  //           href={href}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className={classNameLink}
  //         >
  //           {text}
  //         </a>
  //       );
  //     }
  //   }

  //   // Просто текст (без ссылки)
  //   return <span className={classNameText}>{trimmed}</span>;
  // }

  function renderMarkdownLinks(input: string, classNameLink?: string, classNameText?: string) {
    if (!input) return null;

    // Проверка Markdown-ссылки
    const markdownLinkRegex = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;
    if (markdownLinkRegex.test(input.trim())) {
      const match = input.trim().match(markdownLinkRegex);
      if (match) {
        const [, text, href] = match;
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classNameLink}>
            {text}
          </a>
        );
      }
    }

    // Обработка варианта: "текст, текст | ссылка"
    const parts = input.split("|");
    if (parts.length === 2) {
      const text = parts[0].trim();
      const href = parts[1].trim();
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classNameLink}>
          {text}
        </a>
      );
    }

    // Просто текст без ссылки
    return <span className={classNameText}>{input}</span>;
  }

  const isCurrentMonthSelected = selectedMonthYear === monthYearOptions[0]?.value;

  return (
    <>
      <Seo title={t("meta.events_title")} description={t("meta.events_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.events_title")}</h1>

      <div className={styles.articleContainer}>
        {isCurrentMonthSelected && (
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
        )}
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

        <div className={styles.container}>
          {filteredEvents.map((event) => (
            <div key={event.slug} id={event.slug} className={styles.eventCard}>
              <div className={styles.titleBox}>
                <h2 className={styles.eventTitle}>{event.title}</h2>
              </div>

              <div className={styles.eventImageOrt}>
                <div className={styles.eventLocation}>
                  {event.time && (
                    <p className={styles.box}>
                      <span className={styles.label}>{t("event.time")}:</span>
                      <span className={styles.value}>{event.time}</span>
                    </p>
                  )}
                  {event.ort && (
                    <p className={styles.box}>
                      <span className={styles.label}>{t("event.ort")}:</span>
                      {renderMarkdownLinks(event.ort, styles.valueLink, styles.value)}
                    </p>
                  )}

                  {event.link && (
                    <p className={styles.box}>
                      <span className={styles.label}>{t("event.link")}:</span>
                      {renderMarkdownLinks(event.link, styles.valueLink, styles.value)}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window === "undefined" || !event.slug) return;
                      // Берём текущий путь (учтёт /ru или /de) и кодируем hash
                      const base = `${window.location.origin}/${router.locale}/events-page`;
                      const url = `${base}#${encodeURIComponent(event.slug)}`;

                      if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard
                          .writeText(url)
                          .then(() => {
                            setCopiedSlug(event.slug!);
                            setTimeout(() => setCopiedSlug(null), 3000);
                          })
                          .catch((err) => console.error("Clipboard write failed:", err));
                      } else {
                        console.warn("Clipboard not supported");
                      }
                    }}
                    className={styles.copyLinkButton}
                  >
                    {t("event.copy_link2")}
                  </button>
                </div>

                {event.image && (
                  <Image
                    src={event.image}
                    alt={event.imageAlt || event.title}
                    className={styles.eventImage}
                    width={400}
                    height={200}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                )}
              </div>

              <div className={styles.eventContent}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: expandedSlug === event.slug ? event.content : getExcerpt(event.content),
                  }}
                />
                <div className={styles.buttonsContainer}>
                  <div className={styles.buttonsDownload}>
                    <button
                      type="button"
                      onClick={() => handleDownloadICS(event)}
                      className={styles.toggleButton_ics}
                    >
                      {t("event.add_to_calendar_ics")}
                    </button>
                    {event.date && (
                      <a
                        href={`https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
                          event.title
                        )}&dates=${formatDateForGoogle(
                          event.date,
                          event.endDate
                        )}&location=${encodeURIComponent(event.ort || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.toggleButton_google}
                      >
                        {t("event.add_to_google_calendar")}
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setExpandedSlug(expandedSlug === event.slug ? null : event.slug)}
                  >
                    {expandedSlug === event.slug ? t("menu.less") : t("menu.more")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {copiedSlug && <div className={styles.copyToast}>❖ {t("event.link_copied")}</div>}

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
        <div className={styles.archiveLinkBox}>
          <Link href="/past-events-page" className={styles.archiveButton}>
            {t("buttons.past_events")}
          </Link>
        </div>
      </div>
      <SubscribeBox />
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
  const now = new Date(); // текущее время

  const activeEvents = rawEvents.filter((event) => {
    if (!event.date) return false;
    const start = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : start;
    return end >= now; // убираем всё, что закончилось ДО текущего момента
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
