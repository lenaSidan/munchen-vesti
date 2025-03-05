import { useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { getEventsByLocale, Event } from "@/lib/getEvents";
import styles from "@/styles/EventsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

interface EventsProps {
  events: Event[];
}

export default function EventsPage({ events }: EventsProps) {
  const t = useTranslation();
  const [expandedEvents, setExpandedEvents] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (slug: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Функция для рендера только первого параграфа
  const getExcerpt = (htmlContent: string) => {
    if (typeof window === "undefined") return htmlContent;
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    return div.querySelector("p")?.outerHTML || htmlContent;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>{t("menu.announcements")}</h2>

      {events.map((event) => (
        <div key={event.slug} className={styles.eventCard}>
          <h2 className={styles.eventTitle}>{event.title}</h2>
          <p className={styles.meta}>
            {event.date} {event.ort && `| ${event.ort}`}
          </p>

          <div className={styles.eventImageOrt}>
            <div className={styles.eventLocation}>
              {event.date && (
                <p className={styles.box}>
                  <span className={styles.label}>{t("event.time")}: </span>
                  <span className={styles.value}>{event.date}</span>
                </p>
              )}

              {event.ort && (
                <p className={styles.box}>
                  <span className={styles.label}>{t("event.ort")}: </span>
                  <span className={styles.value}>{event.ort}</span>
                </p>
              )}

              {event.link && (
                <p className={styles.box}>
                  <span className={styles.label}>{t("event.link")}: </span>
                  <Link href={event.link} className={styles.valueLink} target="_blank" rel="noopener noreferrer">
                    {event.link}
                  </Link>
                </p>
              )}
            </div>
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                className={styles.eventImage}
                width={400}
                height={200}
                layout="intrinsic"
              />
            )}
          </div>

          <div className={styles.eventContent}>
            <div
              dangerouslySetInnerHTML={{
                __html: expandedEvents[event.slug] ? event.content : getExcerpt(event.content),
              }}
            />

            <button type="button" className={styles.toggleButton} onClick={() => toggleExpand(event.slug)}>
              {expandedEvents[event.slug] ? t("menu.less") : t("menu.more")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Функция обработки Markdown в HTML
async function processMarkdown(content: string) {
  const processedContent = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(content);
  return processedContent.toString();
}

export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
  const rawEvents = getEventsByLocale(locale || "ru");

  // Сортируем события по дате (актуальные в начале)
  const sortedEvents = [...rawEvents].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
    const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
    return dateA - dateB;
  });

  // Парсим Markdown-контент для каждого события
  const events = await Promise.all(
    sortedEvents.map(async (event) => ({
      ...event,
      content: await processMarkdown(event.content),
    }))
  );

  return {
    props: { events },
  };
};
