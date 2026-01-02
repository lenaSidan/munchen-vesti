import BavarianWordOfTheWeek from "@/components/BavarianWordOfTheWeek";
import ImportantNewsBlock from "@/components/ImportantNewsBlock";
import MiniCalendarBlock from "@/components/MiniCalendarBlock";
import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import WeatherInlineBlock from "@/components/WeatherInlineBlock";
import announcementsData from "@/data/announcements.json";
import fullWords from "@/data/bavarian-words.json";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import { DailyWeather, getWeatherForecast } from "@/lib/getWeather";
import styles from "@/styles/Home.module.css";
import fs from "fs/promises";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import { useEffect, useRef, useState } from "react";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import type { WordData } from "types/WordData";

// Лениво загружаем мобильную версию
const HomeMobile = dynamic(() => import("@/components/HomeMobile"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

// Новости и открытки — также ленивые
const LazyShortNewsBlock = dynamic(() => import("@/components/ShortNewsBlock"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const MiniPostcards = dynamic(() => import("@/components/MiniPostcards"), { ssr: false });

// Типы данных
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
  oldWords: WordData[];
}

const sampleWords = fullWords.slice(0, 2);

export default function Home({
  mainEvent,
  secondEvent,
  otherEvents,
  weather,
  oldWords,
}: HomeProps) {
  const t = useTranslation();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [showNewsBlock, setShowNewsBlock] = useState(false);
  const newsRef = useRef<HTMLDivElement | null>(null);

  // Проверка ширины экрана (всегда наверху)
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Следим за блоком новостей (IntersectionObserver)
  useEffect(() => {
    if (!newsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowNewsBlock(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(newsRef.current);
    return () => observer.disconnect();
  }, []);

  // Если мобильное устройство — показываем HomeMobile
  if (isMobile) {
    return (
      <HomeMobile
        mainEvent={mainEvent}
        weather={weather}
        oldWords={oldWords}
        otherEvents={otherEvents}
      />
    );
  }

  // Десктопная версия
  return (
    <>
      <Seo title={t("seo.index_title")} description={t("seo.index_description")} />
      <h1 className={styles.visuallyHidden}>{t("home.page_title")}</h1>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Главная статья / событие */}
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
                {mainEvent.time && <div className={styles.articleDate}>{mainEvent.time}</div>}
                <div className={styles.decorativeLine}></div>
                <div
                  className={styles.articleContent}
                  dangerouslySetInnerHTML={{ __html: mainEvent.content }}
                />
              </article>
            )}
          </div>

          {/* Боковая колонка */}
          <div className={styles.adsBlock}>
            <MiniCalendarBlock />
            {weather && <WeatherInlineBlock forecast={weather} />}
            <BavarianWordOfTheWeek words={sampleWords} />
          </div>
        </div>

        {/* Подписка и мини-открытки */}
        <SubscribeBox />
        <div className={styles.miniPostcardsBlock}>
          <MiniPostcards />
        </div>

        {/* Второе событие */}
        {secondEvent && (
          <article className={styles.secondArticle}>
            <div className={styles.secondArticleHeader}>
              <h2 className={styles.secondArticleTitle}>{secondEvent.title}</h2>
              {secondEvent.time && <div className={styles.articleDate}>{secondEvent.time}</div>}
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

        {/* Остальные события */}
        {otherEvents.length > 0 && (
          <section className={styles.otherArticles}>
            <Link
              href="/events-page"
              className={`${styles.otherArticlesTitle} ${styles.navLink} ${
                router.pathname === "/events-page" ? styles.active : ""
              }`}
            >
              {t("home.view_all_articles")}
            </Link>
            <ul className={styles.otherArticlesList}>
              {otherEvents.map((event) => (
                <li
                  key={Array.isArray(event.slug) ? event.slug.join("-") : event.slug}
                  className={styles.articleLink}
                >
                  <Link
                    href={`/events-page#${
                      Array.isArray(event.fileId) ? event.fileId[0] : event.fileId
                    }`}
                  >
                    {event.title} <span className={styles.articleDate}> | {event.time}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Новости */}
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
        {/* {
          <div>
            <ImportantNewsBlock />
          </div>
        } */}
      </div>
    </>
  );
}

// ================== MARKDOWN PROCESSOR ==================
async function processMarkdown(content: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);
  return processedContent.toString();
}

// ================== STATIC PROPS ==================
export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  const events = getEventsByLocale(locale || "ru");
  const now = new Date();
  const tenDaysLater = new Date(now);
  tenDaysLater.setDate(tenDaysLater.getDate() + 20);

  const filteredEvents = events.filter((event) => {
    if (!event.date) return false;
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    return (startDate >= now && startDate <= tenDaysLater) || (startDate <= now && endDate >= now);
  });

  const sortedEvents = filteredEvents.sort(
    (a, b) => new Date(a.date || "").getTime() - new Date(b.date || "").getTime()
  );

  const translations = await import(`@/locales/${locale || "ru"}.json`);

  const mainEvent =
    sortedEvents.length > 0
      ? { ...sortedEvents[0], content: await processMarkdown(sortedEvents[0].content) }
      : null;

  let secondEvent: ExtendedEvent | null = null;
  if (sortedEvents.length > 1) {
    secondEvent = {
      ...sortedEvents[1],
      content: await processMarkdown(sortedEvents[1].content),
    };
  }

  const otherEvents = sortedEvents.slice(2, 5);

  const translatedAnnouncements = announcementsData.map((ann: Announcement) => ({
    ...ann,
    text: translations[ann.textKey] || ann.textKey,
  }));

  const weather = await getWeatherForecast();

  const oldwordDir = path.join(process.cwd(), "public", "oldwords", locale === "de" ? "de" : "ru");
  let oldWords: WordData[] = [];

  try {
    const files = await fs.readdir(oldwordDir);
    const shuffled = files.sort(() => 0.5 - Math.random());
    const selectedFiles = shuffled.slice(0, 3);

    oldWords = await Promise.all(
      selectedFiles.map(async (file) => {
        const content = await fs.readFile(path.join(oldwordDir, file), "utf-8");
        const { data } = matter(content);
        return data as WordData;
      })
    );
  } catch (e) {
    console.error("Error loading oldWords:", e);
  }

  return {
    props: {
      mainEvent,
      secondEvent,
      otherEvents,
      announcements: translatedAnnouncements,
      weather,
      oldWords,
    },
    revalidate: 43200,
  };
};
