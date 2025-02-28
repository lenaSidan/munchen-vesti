import { useRouter } from "next/router";
import { getArticlesByLocale, Article } from "@/lib/getArticles"; // ✅ Импортируем интерфейс

import Link from "next/link";
import { GetStaticProps } from "next";

interface ArticlesProps {
  articles: Article[]; // ✅ Теперь используем тот же Article, что и в getArticles.ts
}

export default function Articles({ articles }: ArticlesProps) {
  const { locale } = useRouter();

  return (
    <div>
      <h1>{locale === "ru" ? "Статьи" : "Artikel"}</h1>
      {articles.map((article) => (
        <div key={article.slug}>
          <h2>{article.title}</h2>
          <p>{article.date}</p>
          <p>{article.author}</p>
          <Link href={`/articles/${article.slug}`}>
            <button>Читать далее</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<ArticlesProps> = async ({ locale }) => {
  const articles = getArticlesByLocale(locale || "ru");
  return { props: { articles } };
};
