import PageHead from "@/components/PageHead";
import SocialLinks from "@/components/SocialLinks";
import useTranslation from "@/hooks/useTranslation";
import { getEventsByLocale } from "@/lib/getEvents";
import { renderMarkdownLinks } from "@/lib/renderMarkdownLinks";
import styles from "@/styles/Event.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface Event {
  fileId: string;
  title: string;
  shortTitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  date?: string;
  endDate?: string;
  calendarStartDate?: string;
  calendarEndDate?: string;
  time?: string;
  ort?: string;
  link?: string;
  image?: string;
  imageAlt?: string;
  content: string;
}

interface EventProps {
  event: Event;
  locale: string;
  archived: boolean;
  similarEvents: Event[];
}

export default function Event({ event, locale, archived, similarEvents }: EventProps) {
  const t = useTranslation();
  const [fromCalendar, setFromCalendar] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = sessionStorage.getItem("fromCalendar");
      if (flag === "true") {
        setFromCalendar(true);
        sessionStorage.removeItem("fromCalendar");
      }
    }
  }, []);

  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}events/${event.fileId}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.seoDescription || "",
    startDate: event.date,
    endDate: event.endDate || event.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.ort || "München",
    },
    image: event.image ? [`https://munchen-vesti.de${event.image}`] : [],
  };
  return (
    <>
      <PageHead
        title={(event.seoTitle || event.title) + " – " + t("meta.default_title")}
        description={event.seoDescription || t("meta.default_description")}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className={styles.articleContainer}>
        <h2 className={styles.title}>{event.title}</h2>
        <div className={styles.meta}>
          {event.time}
          {event.ort && <span className={styles.ort}>{renderMarkdownLinks(event.ort)}</span>}
        </div>

        {/* {archived && <div className={styles.archivedNotice}>⚠️ {t("events.archived_notice")}</div>} */}

        {event.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={event.image}
              alt={event.imageAlt || event.title}
              width={600}
              height={400}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: event.content }} />

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>

          <Link
            href={fromCalendar ? "/calendar" : archived ? "/past-events-page" : "/events-page"}
            className={styles.readMore}
          >
            {t("articles.back")}
          </Link>

          <div className={`${styles.decorativeLine} ${styles.bottom}`}>
            <span className={styles.right}>⊱❧</span>
            <span className={styles.left}>⊱❧</span>
          </div>
        </div>

        {archived && similarEvents.length > 0 && (
          <div className={styles.similarEvents}>
            <h3 className={styles.similarTitle}>{t("events.similar_events")}</h3>
            <ul className={styles.similarList}>
              {similarEvents.map((e) => (
                <li key={e.fileId}>
                  <Link href={`/events/${e.fileId}`}>{e.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.socialLinks}>
        <SocialLinks />
      </div>
    </>
  );
}

/* ---------------------- STATIC GENERATION ---------------------- */

export const getStaticPaths: GetStaticPaths = async () => {
  const ruEvents = getEventsByLocale("ru");
  const deEvents = getEventsByLocale("de");

  const makePaths = (events: Event[], locale: string) =>
    events.map((event) => ({
      params: { slug: event.fileId },
      locale,
    }));

  const paths = [...makePaths(ruEvents, "ru"), ...makePaths(deEvents, "de")];
  return { paths, fallback: "blocking" };
};

export const getStaticProps = async ({ params, locale }: GetStaticPropsContext) => {
  if (!params?.slug || !locale) return { notFound: true };

  const slugParam = String(params.slug).toLowerCase();

  const eventsDir = path.join(process.cwd(), "public/events");
  const archiveDir = path.join(eventsDir, "arhiv");

  const files = fs.readdirSync(eventsDir);
  const archivedFiles = fs.existsSync(archiveDir) ? fs.readdirSync(archiveDir) : [];
  const allFiles = [...files, ...archivedFiles];

  const fileMatch = allFiles.find((filename) => {
    const base = filename.replace(`.${locale}.md`, "").toLowerCase();
    return base === slugParam;
  });

  if (!fileMatch) return { notFound: true };

  const isArchived = archivedFiles.includes(fileMatch);
  const filePath = isArchived ? path.join(archiveDir, fileMatch) : path.join(eventsDir, fileMatch);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  const allCurrentEvents = getEventsByLocale(locale);
  const similarEvents = allCurrentEvents.filter((e) => e.fileId !== slugParam).slice(0, 3);

  return {
    props: {
      event: {
        fileId: slugParam,
        title: data.title || "",
        shortTitle: data.title || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        date: data.date || "",
        endDate: data.endDate || "",
        calendarStartDate: data.calendarStartDate || "",
        calendarEndDate: data.calendarEndDate || "",
        time: data.time || "",
        ort: data.ort || "",
        link: data.link || "",
        image: data.image || "",
        imageAlt: data.imageAlt || "",
        content: contentHtml,
      },
      locale,
      archived: isArchived,
      similarEvents,
    },
    revalidate: isArchived ? 86400 : 600, // ✅ архив обновляется раз в сутки, остальные — каждые 10 мин
  };
};
