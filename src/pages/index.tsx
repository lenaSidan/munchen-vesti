import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { getEventsByLocale, Event } from "@/lib/getEvents";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Home.module.css";
import announcementsData from "@/data/announcements.json";
import Announcements from "@/components/Announcements";

import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

interface Announcement {
  id: number;
  textKey: string;
  image?: string;
  styleClass?: string;
}

interface HomeProps {
  mainEvent: Event | null;
  secondEvent: Event | null;
  otherEvents: Event[];
  announcements: Announcement[];
}

export default function Home({ mainEvent, secondEvent, otherEvents }: HomeProps) {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      {/* Главная статья + объявления */}
      <div className={styles.layout}>
        <div className={styles.articlesSection}>
          {mainEvent && (
            <article className={styles.mainArticle}>
              {mainEvent.image && (
                <Image
                  src={mainEvent.image}
                  alt={mainEvent.title}
                  className={styles.mainImage}
                  width={800}
                  height={450}
                  layout="responsive"
                  priority
                />
              )}
              <h2 className={styles.articleTitle}>{mainEvent.title}</h2>
              {/* <p className={styles.articleDate}>{mainEvent.date}</p> */}
              <div className={styles.decorativeLine}>
                <span className={styles.left}>⊱</span>
                <span className={styles.right}>⊰</span>
              </div>

              <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: mainEvent.content }} />
            </article>
          )}
        </div>

        {/* Блок объявлений */}
        <Announcements />
      </div>

      {/* Вторая статья */}
      {secondEvent && (
        <article className={styles.secondArticle}>
          <div className={styles.secondArticleHeader}>
            <h2 className={styles.articleTitle}>{secondEvent.title}</h2>
            <div className={styles.decorativeLine}>
              <span className={styles.left}>⊱</span>
              <span className={styles.right}>⊰</span>
            </div>
            <p className={styles.articleDate}>{secondEvent.date}</p>
          </div>

          <div className={styles.secondArticleContent}>
            {secondEvent.image && (
              <Image
                src={secondEvent.image}
                alt={secondEvent.title}
                className={styles.secondImage}
                width={600}
                height={350}
                layout="intrinsic"
              />
            )}
            <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: secondEvent.content }} />
          </div>
        </article>
      )}

      {/* Ссылки на другие статьи */}
      {otherEvents.length > 0 && (
        <section className={styles.otherArticles}>
          <h4 className={styles.otherArticlesTitle}>{t("home.view_all_articles")}</h4>
          <ul className={styles.otherArticlesList}>
            {otherEvents.map((event) => (
              <li key={event.slug} className={styles.articleLink}>
                <Link href={`/events/${event.slug}`}>
                  {event.title} <span className={styles.eventDate}>{event.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// Функция обработки Markdown в HTML
async function processMarkdown(content: string) {
  const processedContent = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(content);
  return processedContent.toString();
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  const events = getEventsByLocale(locale || "ru");

  // Загружаем переводы
  const translations = await import(`@/locales/${locale || "ru"}.json`);

  // Обрабатываем Markdown для главной и второй статьи
  const mainEvent = events[0] ? { ...events[0], content: await processMarkdown(events[0].content) } : null;
  const secondEvent = events[1] ? { ...events[1], content: await processMarkdown(events[1].content) } : null;

  // Загружаем объявления из JSON и переводим их
  const translatedAnnouncements = announcementsData.map((ann: Announcement) => ({
    ...ann,
    text: translations[ann.textKey] || ann.textKey, // Переводим объявления
  }));

  return {
    props: {
      mainEvent,
      secondEvent,
      otherEvents: events.length > 2 ? events.slice(2, 5) : [],
      announcements: translatedAnnouncements, // ✅ Теперь объявления переведены
    },
  };
};
