import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import fs from "fs";
import PageHead from "@/components/PageHead";
import useTranslation from "@/hooks/useTranslation";
import { getArticleJsonLd } from "@/lib/jsonld/articleJsonLd";
import { getArticleBySlug, FullArticle } from "@/lib/getArticleBySlug";
import styles from "@/styles/NewsArticle.module.css";

interface ArticleProps {
  article: FullArticle;
  locale: string;
}

export default function ArticlesArticlePage({ article, locale }: ArticleProps) {
  const t = useTranslation();

  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}articles/${article.slug}`;
  const jsonLd = getArticleJsonLd({
    title: article.title,
    description: article.seoDescription || "",
    url: canonicalUrl,
    image: article.image,
    author: article.author || "",
  });

  return (
    <>
      <PageHead
        title={`${article.seoTitle || article.title} – ${t("meta.default_title")}`}
        description={article.seoDescription || t("meta.default_description")}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className={styles.articleContainer}>
        <div className={styles.articleBox}>
          <h2 className={styles.title}>{article.title}</h2>

          {article.author && (
            <p className={styles.author}>
              {t("articles.author")}: {article.author}
            </p>
          )}

          {article.image && (
            <div className={styles.imageWrapper}>
              <Image
                src={article.image}
                alt={article.imageAlt || article.title}
                width={800}
                height={300}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/articles-page" className={styles.readMore}>
            {t("articles.back")}
          </Link>
          <div className={`${styles.decorativeLine} ${styles.bottom}`}>
            <span className={styles.right}>⊱❧</span>
            <span className={styles.left}>⊱❧</span>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), "public/articles");
  const files = fs.readdirSync(dir);

  const paths = files
    .map((f) => f.replace(/\.(ru|de)\.md$/, ""))
    .filter((slug, i, self) => self.indexOf(slug) === i)
    .flatMap((slug) => [
      { params: { slug }, locale: "ru" },
      { params: { slug }, locale: "de" },
    ]);

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ArticleProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const article = await getArticleBySlug(params.slug as string, locale);
  if (!article) return { notFound: true };

  return {
    props: { article, locale },
    revalidate: 600,
  };
};
