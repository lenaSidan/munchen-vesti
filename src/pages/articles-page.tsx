import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/ArticlesPage.module.css";

interface ArticlesArticle {
  id: number;
  slug: string;
  title: string;
  author?: string;
  image?: string;
  content: string;
}

interface ArticlesProps {
  articles: ArticlesArticle[];
}

export default function ArticlesPage({ articles }: ArticlesProps) {
  const t = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {t("meta.articles_title")} – {t("meta.default_title")}
        </title>
        <meta name="description" content={t("meta.articles_description")} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t("meta.articles_title")} />
        <meta property="og:description" content={t("meta.articles_description")} />
        <meta property="og:image" content="/default-og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://munchen-vesti.de${router.asPath}`} />
      </Head>
      <div className={styles.container}>
        <h3 className={styles.pageTitle}>{t("articles.articles")}</h3>

        {articles.map((article, index) => (
          <article key={article.slug} className={index % 2 === 0 ? styles.articleVariantA : styles.articleVariantB}>
            <div className={styles.articleHeader}>
              <h2 className={styles.articleTitle}>{article.title}</h2>
            </div>
            <div className={styles.image_textBox}>
              {article.image && (
                <Image
                  src={article.image}
                  alt={article.title}
                  className={styles.articleImage}
                  width={400}
                  height={200}
                />
              )}
              <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: article.content }} />
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
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<ArticlesProps> = async ({ locale }) => {
  const summariesDirectory = path.join(process.cwd(), "public/articles_summaries");
  const files = fs.readdirSync(summariesDirectory);

  const articles = await Promise.all(
    files
      .filter((file) => file.endsWith(`.${locale}.md`))
      .map(async (file) => {
        const filePath = path.join(summariesDirectory, file);
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContents);

        const processedContent = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(content);

        return {
          id: data.id || 0, // 🆕 Берем id из фронтматтера
          slug: file.replace(`.${locale}.md`, ""),
          title: data.title || "Без названия",
          author: data.author || "",
          image: data.image || null,
          content: processedContent.toString(),
        };
      })
  );

  //Сортируем по id (от большего к меньшему, чтобы новые были первыми)
  articles.sort((a, b) => b.id - a.id);

  return {
    props: {
      articles,
    },
  };
};
