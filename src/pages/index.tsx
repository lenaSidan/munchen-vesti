import { GetStaticProps } from "next";
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
import Ads from "@/components/Ads";
import { useRouter } from "next/router";

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
  const router = useRouter();

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
                  width={700}
                  height={350}
                  priority={true}
                />
              )}
              <h2 className={styles.articleTitle}>{mainEvent.title}</h2>
              <p className={styles.articleDate}>{mainEvent.date}</p>
              <div className={styles.decorativeLine}>
                {/* <span className={styles.left}>𐎐</span>
                <span className={styles.right}>𐎐</span> */}
              </div>

              <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: mainEvent.content }} />
            </article>
          )}
        </div>

        {/* Блок объявлений */}
        <Ads />
      </div>
     
      {/* Вторая статья */}
      {secondEvent && (
        <article className={styles.secondArticle}>
          <div className={styles.secondArticleHeader}>
            <h2 className={styles.secondArticleTitle}>{secondEvent.title}</h2>
            <p className={styles.articleDate}>{secondEvent.date}</p>
            <div className={styles.decorativeLine}>
              {/* <span className={styles.left}>𐎐</span>
              <span className={styles.right}>𐎐</span> */}
            </div>
          </div>

          <div className={styles.secondArticleContent}>
            {secondEvent.image && (
              <Image
                src={secondEvent.image}
                alt={secondEvent.title}
                className={styles.secondImage}
                width={600}
                height={350}
              />
            )}
            <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: secondEvent.content }} />
          </div>
        </article>
      )}

      {/* Ссылки на другие статьи */}
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
              <li key={event.slug} className={styles.articleLink}>
                <Link href={`/events/${event.slug}`} legacyBehavior>
                  <a>
                    {event.title} <span className={styles.articleDate}>{event.date}</span>
                  </a>
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

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Убираем время для корректного сравнения

  const sortedEvents = events
    .filter((event) => {
      if (!event.date) return false; // Пропускаем события без даты
      const startDate = new Date(event.date).getTime();
      return startDate >= today.getTime(); // Оставляем только будущие события
    })
    .sort((a, b) => {
      const startDateA = new Date(a.date || "").getTime();
      const startDateB = new Date(b.date || "").getTime();

      if (startDateA !== startDateB) {
        return startDateA - startDateB; // Сортируем по дате начала (сначала ближайшие)
      }

      // Если даты начала одинаковые, сортируем по дате окончания (если есть)
      const endDateA = a.endDate ? new Date(a.endDate).getTime() : startDateA;
      const endDateB = b.endDate ? new Date(b.endDate).getTime() : startDateB;

      return endDateA - endDateB; // Более короткие события идут первыми
    });

  console.log(
    "📅 Отфильтрованные и отсортированные события:",
    sortedEvents.map((e) => e.date)
  );

  // Загружаем переводы
  const translations = await import(`@/locales/${locale || "ru"}.json`);

  // Обрабатываем Markdown для главной и второй статьи
  const mainEvent =
    sortedEvents.length > 0 ? { ...sortedEvents[0], content: await processMarkdown(sortedEvents[0].content) } : null;

  const secondEvent =
    sortedEvents.length > 1 ? { ...sortedEvents[1], content: await processMarkdown(sortedEvents[1].content) } : null;

  // Загружаем объявления из JSON и переводим их
  const translatedAnnouncements = announcementsData.map((ann: Announcement) => ({
    ...ann,
    text: translations[ann.textKey] || ann.textKey, // Переводим объявления
  }));

  return {
    props: {
      mainEvent,
      secondEvent,
      otherEvents: sortedEvents.length > 2 ? sortedEvents.slice(2, 5) : [],
      announcements: translatedAnnouncements,
    },
  };
};
