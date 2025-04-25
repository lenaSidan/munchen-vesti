import { GetStaticProps } from "next";
import Seo from "@/components/Seo";
import Link from "next/link";
import Image from "next/image";
import { getEventsByLocale, Event } from "@/lib/getEvents";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Home.module.css";
import announcementsData from "@/data/announcements.json";
import rehypeExternalLinks from "rehype-external-links";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { useRouter } from "next/router";
import { getWeatherForecast, DailyWeather } from "@/lib/getWeather";
import Ads from "@/components/Ads";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { formatHumanDate } from "@/lib/formatHumanDate";

interface Announcement {
  id: number;
  textKey: string;
  image?: string;
  styleClass?: string;
}

interface ExtendedEvent extends Event {
  content: string;
}

interface HomeProps {
  mainEvent: Event | null;
  secondEvent: ExtendedEvent | null;
  otherEvents: Event[];
  announcements: Announcement[];
  weather: DailyWeather | null;
}
const LazyShortNewsBlock = dynamic(() => import("@/components/ShortNewsBlock"), {
  ssr: false,
  loading: () => <p>Загрузка...</p>, // можно сюда засунуть заглушку или скелетон
});
const LazyEasterEgg = dynamic(() => import("@/components/EasterEggById"), {
  ssr: false,
});

export default function Home({ mainEvent, secondEvent, otherEvents, weather }: HomeProps) {
  const t = useTranslation();
  const router = useRouter();

  const [showNewsBlock, setShowNewsBlock] = useState(false);
  const newsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!newsRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowNewsBlock(true);
          observer.disconnect(); // отписка, чтобы не наблюдать больше
        }
      },
      {
        rootMargin: "100px", // загружать чуть раньше
      }
    );

    observer.observe(newsRef.current);

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Seo title={t("seo.index_title")} description={t("seo.index_description")} />
      <h1 className={styles.visuallyHidden}>{t("home.page_title")}</h1>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.articlesSection}>
            {mainEvent && (
              <article className={styles.mainArticle}>
                {mainEvent.image && (
                  <Image
                    src={mainEvent.image}
                    alt={mainEvent.title}
                    className={styles.mainImage}
                    width={700}
                    height={400}
                    priority
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 700px"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
                <h2 className={styles.articleTitle}>{mainEvent.title}</h2>
                {mainEvent.date && (
                  <p className={styles.articleDate}>{formatHumanDate(mainEvent.date, router.locale || "ru")}</p>
                )}
                <div className={styles.decorativeLine}></div>
                <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: mainEvent.content }} />
              </article>
            )}
          </div>
          <div className={styles.adsBlock}>
            <Ads weather={weather} />
          </div>
        </div>

        {secondEvent && (
          <article className={styles.secondArticle}>
            <div className={styles.secondArticleHeader}>
              <h2 className={styles.secondArticleTitle}>{secondEvent.title}</h2>
              {secondEvent.date && (
                <p className={styles.articleDate}>{formatHumanDate(secondEvent.date, router.locale || "ru")}</p>
              )}{" "}
              <div className={styles.decorativeLine}></div>
            </div>
            <div className={styles.secondArticleGrid}>
              {secondEvent.image && (
                <Image
                  src={secondEvent.image}
                  alt={secondEvent.title || "Event image"}
                  className={styles.secondImage}
                  width={400}
                  height={228}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: secondEvent.content }} />
            </div>
          </article>
        )}

        {otherEvents.length > 0 && (
          <section className={styles.otherArticles}>
            <Link
              href="/events"
              className={`${styles.otherArticlesTitle} ${styles.navLink} ${
                router.pathname === "/events" ? styles.active : ""
              }`}
            >
              {t("home.view_all_articles")}
            </Link>
            <ul className={styles.otherArticlesList}>
              {otherEvents.map((event) => (
                <li key={event.slug} className={styles.articleLink}>
                  <Link href={`/events/${event.slug}`}>
                    {event.title} <span className={styles.articleDate}> | {event.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className={styles.newsBlock} ref={newsRef}>
          {showNewsBlock && (
            <div className={styles.newsFadeIn}>
              <LazyShortNewsBlock />
              <Link href="/news-page" className={styles.viewAllLink}>
                {t("news.go_to_newsPage")} →
              </Link>
            </div>
          )}
        </div>

        {showNewsBlock && <LazyEasterEgg id="easteregg-home" chance={0.5} />}
      </div>
    </>
  );
}

async function processMarkdown(content: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);
  return processedContent.toString();
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  const events = getEventsByLocale(locale || "ru");

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const tenDaysLater = new Date(now);
  tenDaysLater.setDate(tenDaysLater.getDate() + 20);

  const filteredEvents = events.filter((event) => {
    if (!event.date) return false;
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    return (startDate >= now && startDate <= tenDaysLater) || (startDate <= now && endDate >= now);
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    const startDateA = new Date(a.date || "").getTime();
    const startDateB = new Date(b.date || "").getTime();
    return startDateA - startDateB;
  });

  const translations = await import(`@/locales/${locale || "ru"}.json`);

  const mainEvent =
    sortedEvents.length > 0 ? { ...sortedEvents[0], content: await processMarkdown(sortedEvents[0].content) } : null;

  let secondEvent: ExtendedEvent | null = null;
  if (sortedEvents.length > 1) {
    secondEvent = {
      ...sortedEvents[1],
      content: await processMarkdown(sortedEvents[1].content),
    };
  }

  const otherEvents = await Promise.all(
    sortedEvents.slice(2, 5).map(async (e) => ({
      ...e,
      content: await processMarkdown(e.content),
    }))
  );

  const translatedAnnouncements = announcementsData.map((ann: Announcement) => ({
    ...ann,
    text: translations[ann.textKey] || ann.textKey,
  }));

  const weather = await getWeatherForecast();

  return {
    props: {
      mainEvent,
      secondEvent,
      otherEvents,
      announcements: translatedAnnouncements,
      weather,
    },
    revalidate: 43200,
  };
};
