import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/ArticlesPage.module.css";
import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import { getArticlesByLocale, Article } from "@/lib/getArticles";
// import EasterEggById from "@/components/EasterEggById";

interface ArticlesProps {
  articles: Article[];
}

export default function ArticlesPage({ articles }: ArticlesProps) {
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.articles_title")} description={t("meta.articles_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.articles_title")}</h1>
      <div className={styles.container}>
        {articles.map((article, index) => (
          <article
            key={article.slug}
            className={index % 2 === 0 ? styles.articleVariantA : styles.articleVariantB}
          >
            <div className={styles.articleHeader}>
              <h2 className={styles.articleTitle}>{article.title}</h2>
            </div>

            <div className={styles.image_textBox}>
              {article.image && (
                <Image
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  className={styles.articleImage}
                  width={400}
                  height={200}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              )}
              <div
                className={styles.articleContent}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            <div className={styles.readMoreContainer}>
              <div className={styles.decorativeLine}>
                <span className={styles.left}>⊱❧</span>
                <span className={styles.right}>⊱❧</span>
              </div>

              <Link href={`/articles/${article.slug}`} className={styles.readMore}>
                {t("articles.read_more")}
              </Link>

              <div className={`${styles.decorativeLine} ${styles.bottom}`}>
                <span className={styles.right}>⊱❧</span>
                <span className={styles.left}>⊱❧</span>
              </div>
            </div>
          </article>
        ))}

        {/* <EasterEggById id="easteregg-articles" chance={0.5} /> */}
        <SubscribeBox />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<ArticlesProps> = async ({ locale }) => {
  const articles = getArticlesByLocale(locale || "ru");

  return {
    props: {
      articles,
    },
    revalidate: 600, // ISR каждые 10 минут
  };
};
