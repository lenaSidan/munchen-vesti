import { useRouter } from "next/router";
import { getAllArticles } from "@/lib/getArticles";
import Link from "next/link";
import { GetStaticProps } from "next";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Articles.module.css"; // Подключаем стили

// Определяем интерфейс для статьи
interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
}

interface ArticlesProps {
  articles: Article[];
}

export default function Articles({ articles }: ArticlesProps) {
  const { locale } = useRouter();
  const t = useTranslation();

  return (
    <div className={styles.articlesContainer}>
      <h1 className={styles.title}>{locale === "ru" ? "Статьи" : "Artikel"}</h1>
      {articles.map((article) => (
        <div key={article.slug} className={styles.articleCard}>
          <h2 className={styles.articleTitle}>{article.title}</h2>
          <p className={styles.articleMeta}>{article.date} | {article.author}</p>
          <Link href={`/articles/${article.slug}`}>
            <button className={styles.readMoreButton}>{t("articles.read_more")}</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<ArticlesProps> = async ({ locale }) => {
  const articles = getAllArticles(locale || "ru");
  return { props: { articles } };
};
