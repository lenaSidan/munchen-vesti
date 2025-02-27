import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArticlesByLocale, Article } from "@/lib/getArticles";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Home.module.css";
import announcements from "@/data/announcements.json";

interface Announcement {
  id: number;
  text: string;
  image?: string;
  styleClass?: string;
}

interface HomeProps {
  mainArticle: Article | null;
  secondArticle: Article | null;
  otherArticles: Article[];
  announcements: Announcement[];
}

export default function Home({ mainArticle, secondArticle, otherArticles, announcements }: HomeProps) {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("home.title")}</h1>

      <div className={styles.layout}>
        <div className={styles.articlesSection}>
          {/* Главная статья */}
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
              <p className={styles.articleDate}>{mainArticle.date}</p>
              <div className={styles.articleContent}>{mainArticle.content}</div>
            </article>
          )}

          {/* Вторая статья (уникальный стиль) */}
          {secondArticle && (
            <article className={styles.secondArticle}>
              <div className={styles.secondArticleHeader}>
                <h2 className={styles.articleTitle}>{secondArticle.title}</h2>
                <p className={styles.articleDate}>{secondArticle.date}</p>
              </div>

              <div className={styles.secondArticleContent}>
                {/* Если у статьи есть картинки, показываем их */}
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
                <p>{secondArticle.content}</p>
              </div>
            </article>
          )}

          {/* Ссылки на другие статьи */}
          {otherArticles.length > 0 && (
            <section className={styles.otherArticles}>
              <h2 className={styles.otherArticlesTitle}>{t("home.view_all_articles")}</h2>
              <ul className={styles.otherArticlesList}>
                {otherArticles.map((article) => (
                  <li key={article.slug} className={styles.articleLink}>
                    <Link href={`/articles/${article.slug}`}>
                      {article.title} – {article.date}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Блок объявлений справа */}
        <aside className={styles.announcements}>
          {announcements.map((announcement) => (
            <div key={announcement.id} className={`${styles.announcementItem} ${styles[announcement.styleClass || "default"]}`}>
              {announcement.image && (
                <Image
                  src={announcement.image}
                  alt="Announcement"
                  className={styles.announcementImage}
                  width={200}
                  height={150}
                  layout="intrinsic"
                />
              )}
              <p className={styles.announcementText}>{announcement.text}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  const articles = getArticlesByLocale(locale || "ru");

  return {
    props: {
      mainArticle: articles[0] || null,
      secondArticle: articles[1] || null,
      otherArticles: articles.length > 2 ? articles.slice(2, 5) : [],
      announcements
    }
  };
};
