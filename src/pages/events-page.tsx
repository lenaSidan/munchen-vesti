import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/EventsPage.module.css";
import { GetStaticProps } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
// import EasterEggById from "@/components/EasterEggById";
import SubscribeBox from "@/components/SubscribeBox";
import { useRouter } from "next/router";
import rehypeExternalLinks from "rehype-external-links";

interface EventsProps {
  events: Event[];
}

export default function EventsPage({ events }: EventsProps) {
  const t = useTranslation();
  const router = useRouter();

  // ❗ Изначально null, после загрузки страницы явно ставим null
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Флаг, что код выполняется на клиенте

  // useEffect(() => {
  //   setIsClient(true); // После рендера отмечаем, что клиент загружен
  //   setExpandedSlug(null); // Закрываем все события
  // }, []);
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
      }, 100); // Ждём немного, чтобы DOM прогрузился
    } else {
      setExpandedSlug(null);
    }
  }, []);

  // Функция переключения раскрытого события
  const toggleExpand = (slug: string) => {
    setExpandedSlug((prevSlug) => (prevSlug === slug ? null : slug));
  };

  // Функция получения только первого параграфа
  const getExcerpt = (htmlContent: string) => {
    if (typeof window === "undefined") return htmlContent;
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    return div.querySelector("p")?.outerHTML || htmlContent;
  };

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  return (
    <>
      <Seo title={t("meta.events_title")} description={t("meta.events_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.events_title")}</h1>
      <div className={styles.container}>
        {/* <h2 className={styles.pageTitle}>{t("menu.announcements")}</h2> */}

        {events.map((event) => (
          <div key={event.slug} id={event.slug} className={styles.eventCard}>
            <div className={styles.titleBox}>
              <h2 className={styles.eventTitle}>{event.title}</h2>
            </div>
            {/* Дата, время и место */}
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
                <button
                  type="button"
                  className={styles.toggleButton}
                  data-testid={`toggle-${event.slug}`}
                  onClick={() => toggleExpand(event.slug)}
                >
                  {expandedSlug === event.slug ? t("menu.less") : t("menu.more")}
                </button>
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
                  {t("event.copy_link")}
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* <div className={styles.archiveLinkBox}>
          <Link href="/past-events-page" className={styles.archiveLink}>
            {t("buttons.past_events")}
          </Link>
        </div> */}
      </div>
      {copiedSlug && <div className={styles.copyToast}> ❖ {t("event.link_copied")}</div>}
      <SubscribeBox />
      {/* <EasterEggById id="easteregg-events" chance={0.5} /> */}
    </>
  );
}

// Функция обработки Markdown в HTML
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
  today.setHours(0, 0, 0, 0); // Убираем время

  const activeEvents = rawEvents.filter((event) => {
    if (!event.date) return false;

    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    return endDate >= today; // Событие ещё не закончилось
  });

  const sortedEvents = activeEvents.sort((a, b) => {
    const startA = new Date(a.date!).getTime();
    const startB = new Date(b.date!).getTime();
    return startA - startB;
  });

  console.log(
    "📅 Актуальные события для /events-page:",
    sortedEvents.map((e) => `${e.title} (${e.date}${e.endDate ? "–" + e.endDate : ""})`)
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
