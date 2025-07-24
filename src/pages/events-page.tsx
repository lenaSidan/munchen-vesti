import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/EventsPageNew.module.css";
import { GetStaticProps } from "next";
import Image from "next/image";
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
    const optionsSet = new Set<string>();
    const optionsList: { value: string; label: string }[] = [];

    events.forEach((event) => {
      if (!event.date) return;
      const date = new Date(event.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthName = t(`months.${date.toLocaleString("en", { month: "long" }).toLowerCase()}`);
      const value = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
      if (!optionsSet.has(value)) {
        optionsSet.add(value);
        optionsList.push({ value, label: `${monthName} ${year}` });
      }
    });

    return optionsList;
  }, [events, t]);

  useEffect(() => {
    if (!selectedMonthYear && monthYearOptions.length > 0) {
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
      const date = new Date(event.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
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

  return (
    <>
      <Seo title={t("meta.events_title")} description={t("meta.events_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.events_title")}</h1>

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
                    <span className={styles.value}>{event.ort}</span>
                  </p>
                )}
                {event.link && (
                  <p className={styles.box}>
                    <span className={styles.label}>{t("event.link")}:</span>
                    {event.link.split(",").map((link, index) => {
                      const match = link.trim().match(/\[(.*?)\]\((.*?)\)/);
                      if (!match) return null;
                      const [, text, href] = match;
                      return (
                        <span key={index}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.valueLink}
                          >
                            {text}
                          </a>
                          {index < event.link.split(",").length - 1 && " | "}
                        </span>
                      );
                    })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && event.slug && router.locale) {
                      const url = `${window.location.origin}/${router.locale}/events-page#${event.slug}`;
                      if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard
                          .writeText(url)
                          .then(() => {
                            setCopiedSlug(event.slug);
                            setTimeout(() => setCopiedSlug(null), 3000);
                          })
                          .catch((err) => {
                            console.error("Clipboard write failed:", err);
                          });
                      } else {
                        console.warn("Clipboard not supported");
                      }
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeEvents = rawEvents.filter((event) => {
    if (!event.date) return false;
    const start = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : start;
    return end >= today;
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
