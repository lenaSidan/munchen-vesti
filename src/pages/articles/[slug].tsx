import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

import PageHead from "@/components/PageHead";
import useTranslation from "@/hooks/useTranslation";
import { getArticleJsonLd } from "@/lib/jsonld/articleJsonLd";

import styles from "@/styles/NewsArticle.module.css";

interface ArticlesArticle {
  id: number;
  slug: string;
  title: string;
  shortTitle?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  image: string;
  imageAlt?: string;
  content: string;
}

interface ArticleProps {
  article: ArticlesArticle;
  locale: string;
}

export default function ArticlesArticlePage({ article, locale }: ArticleProps) {
  const t = useTranslation();

  const fullUrl = `https://munchen-vesti.de/${locale}/articles/${article.slug}`;
  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}article/${article.slug}`;

  const jsonLd = getArticleJsonLd({
    title: article.title,
    description: article.seoDescription || "",
    url: fullUrl,
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

          {article.image && article.image.length > 5 && (
            <div className={styles.imageWrapper}>
              <Image
                src={article.image}
                alt={article.imageAlt || article.title || "Image"}
                width={800}
                height={300}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {article.content ? (
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p>{t("articles.no_content") || "Контент недоступен."}</p>
          )}
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

      {/* <div className={styles.socialLinks}>
        <SocialLinks />
      </div> */}
    </>
  );
}

// Генерация путей
export const getStaticPaths: GetStaticPaths = async () => {
  const articlesDirectory = path.join(process.cwd(), "public/articles");
  const files = fs.readdirSync(articlesDirectory);

  const paths = files
    .map((file) => file.replace(/\.(ru|de)\.md$/, ""))
    .filter((slug, index, self) => self.indexOf(slug) === index)
    .flatMap((slug) => [
      { params: { slug }, locale: "ru" },
      { params: { slug }, locale: "de" },
    ]);

  return { paths, fallback: "blocking" };
};

// Загрузка статьи
export const getStaticProps: GetStaticProps<ArticleProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const slug = params.slug as string;
  const filePath = path.join(process.cwd(), "public/articles", `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) {
    console.warn("Файл статьи не найден:", filePath);
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);

  return {
    props: {
      article: {
        id: typeof data.id === "number" ? data.id : 0,
        slug,
        title: typeof data.title === "string" ? data.title : "Без названия",
        shortTitle: data.shortTitle || null,
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        author: data.author || "",
        image: typeof data.image === "string" ? data.image : "",
        imageAlt: data.imageAlt || "",
        content: processedContent.toString(),
      },
      locale,
    },
    revalidate: 600,
  };
};
