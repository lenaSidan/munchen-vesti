import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArticlesByLocale, Article } from "@/lib/getArticles";
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
  mainArticle: Article | null;
  secondArticle: Article | null;
  otherArticles: Article[];
  announcements: Announcement[];
}

export default function Home({ mainArticle, secondArticle, otherArticles }: HomeProps) {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      {/* Главная статья + объявления */}
      <div className={styles.layout}>
        <div className={styles.articlesSection}>
          {mainArticle && (
            <article className={styles.mainArticle}>
              {mainArticle.image && (
                <Image
                  src={mainArticle.image}
                  alt={mainArticle.title}
                  className={styles.mainImage}
                  width={800}
                  height={450}
                  layout="responsive"
                  priority
                />
              )}
              <h2 className={styles.articleTitle}>{mainArticle.title}</h2>
              {/* <p className={styles.articleDate}>{mainArticle.date}</p> */}
              <div className={styles.decorativeLine}>
                <span className={styles.left}>⊱</span>
                <span className={styles.right}>⊰</span>
              </div>
              
              <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: mainArticle.content }} />
            </article>
          )}
        </div>

        {/* Блок объявлений */}
        <Announcements />
      </div>

      {/* Вторая статья */}
      {secondArticle && (
        <article className={styles.secondArticle}>
          <div className={styles.secondArticleHeader}>
            <h2 className={styles.articleTitle}>{secondArticle.title}</h2>
            <div className={styles.decorativeLine}>
                <span className={styles.left}>⊱</span>
                <span className={styles.right}>⊰</span>
              </div>
            <p className={styles.articleDate}>{secondArticle.date}</p>
          </div>

          <div className={styles.secondArticleContent}>
            {secondArticle.image && (
              <Image
                src={secondArticle.image}
                alt={secondArticle.title}
                className={styles.secondImage}
                width={600}
                height={350}
                layout="intrinsic"
              />
            )}
            <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: secondArticle.content }} />
          </div>
        </article>
      )}

      {/* Ссылки на другие статьи */}
      {otherArticles.length > 0 && (
        <section className={styles.otherArticles}>
          <h4 className={styles.otherArticlesTitle}>{t("home.view_all_articles")}</h4>
          <ul className={styles.otherArticlesList}>
            {otherArticles.map((article) => (
              <li key={article.slug} className={styles.articleLink}>
                <Link href={`/articles/${article.slug}`}>
                  {article.title} <span className={styles.articleDate}>{article.date}</span>
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
  const articles = getArticlesByLocale(locale || "ru");

  // Загружаем переводы
  const translations = await import(`@/locales/${locale || "ru"}.json`);

  // Обрабатываем Markdown для главной и второй статьи
  const mainArticle = articles[0] ? { ...articles[0], content: await processMarkdown(articles[0].content) } : null;
  const secondArticle = articles[1] ? { ...articles[1], content: await processMarkdown(articles[1].content) } : null;

  // Загружаем объявления из JSON и переводим их
  const translatedAnnouncements = announcementsData.map((ann: Announcement) => ({
    ...ann,
    text: translations[ann.textKey] || ann.textKey, // Переводим объявления
  }));

  return {
    props: {
      mainArticle,
      secondArticle,
      otherArticles: articles.length > 2 ? articles.slice(2, 5) : [],
      announcements: translatedAnnouncements, // ✅ Теперь объявления переведены
    },
  };
};
