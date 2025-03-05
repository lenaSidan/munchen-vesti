import { useState } from "react";
import { GetStaticProps } from "next";
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
        
              {event.link && (
                <p className={styles.box}>
                  <span className={styles.label}>{t("event.link")}: </span>
                  <a className={styles.valueLink} href={event.link} target="_blank" rel="noopener noreferrer">
                    {event.link}
                  </a>
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
                __html: expandedEvents[event.slug] ? event.content : `${event.content.slice(0, 250)}...`,
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

  // Парсим Markdown-контент для каждого события
  const events = await Promise.all(
    rawEvents.map(async (event) => ({
      ...event,
      content: await processMarkdown(event.content),
    }))
  );

  return {
    props: { events },
  };
};
