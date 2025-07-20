import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/EventsPage.module.css";
import { GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setExpandedSlug(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      setExpandedSlug(null);
    }
  }, []);

  const toggleExpand = (slug: string) => {
    setExpandedSlug((prevSlug) => (prevSlug === slug ? null : slug));
  };

  const getExcerpt = (htmlContent: string) => {
    if (typeof window === "undefined") return htmlContent;
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    return div.querySelector("p")?.outerHTML || htmlContent;
  };

  const handleDownloadICS = useCallback(async (event: Event) => {
    const startDate = event.date ? new Date(event.date) : new Date();
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(startDate.getTime() + 60 * 60 * 1000); // +1 час по умолчанию

    const url = `/api/ics?title=${encodeURIComponent(event.title)}&description=${encodeURIComponent(event.content || "")}&location=${encodeURIComponent(event.ort || "")}&start=${encodeURIComponent(startDate.toISOString())}&end=${encodeURIComponent(endDate.toISOString())}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("ICS fetch failed");
      const blob = await response.blob();

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `${event.slug || "event"}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed", err);
    }
  }, []);
  function formatDateForGoogle(startDateString: string, endDateString?: string): string {
    const startDate = new Date(startDateString);
    const endDate = endDateString
      ? new Date(endDateString)
      : new Date(startDate.getTime() + 60 * 60 * 1000);

    const format = (date: Date) =>
      date
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")
        .slice(0, 15) + "Z"; // формат для Google Calendar: YYYYMMDDTHHmmssZ

    return `${format(startDate)}/${format(endDate)}`;
  }
  function stripHtml(html: string): string {
    if (typeof window === "undefined") return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }

  return (
    <>
      <Seo title={t("meta.events_title")} description={t("meta.events_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.events_title")}</h1>
      <div className={styles.container}>
        {events.map((event) => (
          <div key={event.slug} id={event.slug} className={styles.eventCard}>
            <div className={styles.titleBox}>
              <h2 className={styles.eventTitle}>{event.title}</h2>
            </div>
            <p className={styles.meta}>
              {event.time && ` | ${event.time}`}
              {event.ort && ` | ${event.ort}`}
            </p>

            <div className={styles.eventImageOrt}>
              <div className={styles.eventLocation}>
                {event.time && (
                  <p className={styles.box}>
                    <span className={styles.label}>{t("event.time")}: </span>
                    <span className={styles.value}>{event.time}</span>
                  </p>
                )}

                {event.ort && (
                  <p className={styles.box}>
                    <span className={styles.label}>{t("event.ort")}: </span>
                    <span className={styles.value}>{event.ort}</span>
                  </p>
                )}

                {typeof event.link === "string" &&
                  (() => {
                    const links = event.link.split(",");
                    return (
                      <p className={styles.box}>
                        <span className={styles.label}>{t("event.link")}: </span>
                        {links.map((link, index) => {
                          const match = link.trim().match(/\[(.*?)\]\((.*?)\)/);
                          if (!match) return null;
                          const [, text, href] = match;
                          return (
                            <span key={index}>
                              <a
                                href={href}
                                className={styles.valueLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {text}
                              </a>
                              {index < links.length - 1 && " | "}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })()}

                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/${router.locale}/events-page#${event.slug}`;
                    navigator.clipboard.writeText(url);
                    setCopiedSlug(event.slug);
                    setTimeout(() => setCopiedSlug(null), 3000);
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
                  __html:
                    isClient && expandedSlug === event.slug
                      ? event.content
                      : getExcerpt(event.content),
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
                      href={`https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(event.title)}&dates=${formatDateForGoogle(event.date, event.endDate)}&location=${encodeURIComponent(event.ort || "")}`}
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
                  onClick={() => toggleExpand(event.slug)}
                >
                  {expandedSlug === event.slug ? t("menu.less") : t("menu.more")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {copiedSlug && <div className={styles.copyToast}> ❖ {t("event.link_copied")}</div>}
      <SubscribeBox />
    </>
  );
}

async function processMarkdown(content: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);
  return processedContent.toString();
}

export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
  const rawEvents = getEventsByLocale(locale || "ru");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeEvents = rawEvents.filter((event) => {
    if (!event.date) return false;
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    return endDate >= today;
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
