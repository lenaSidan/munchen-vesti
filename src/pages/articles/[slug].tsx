import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/NewsArticle.module.css";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { getArticleJsonLd } from "@/lib/jsonld/articleJsonLd";

interface ArticlesArticle {
  id: number;
  slug: string;
  title: string;
  shortTitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  image: string;
  imageAlt?: string;
  content: string;
}

interface ArticleProps {
  article: ArticlesArticle;
}

export default function ArticlesArticlePage({ article }: ArticleProps) {
  const t = useTranslation();
  const router = useRouter();

  const fullUrl = `https://munchen-vesti.de/${router.locale}/articles/${article.slug}`;

  const jsonLd = getArticleJsonLd({
    title: article.title,
    description: article.seoDescription,
    url: fullUrl,
    image: article.image,
    author: article.author,
  });

  return (
    <>
      <Head>
        <title>{(article.seoTitle || article.title) + " – " + t("meta.default_title")}</title>
        <meta name="description" content={article.seoDescription || t("meta.default_description")} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={article.seoTitle || article.title} />
        <meta property="og:description" content={article.seoDescription || ""} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={fullUrl} />

        ✅ JSON-LD
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
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
  const newsDirectory = path.join(process.cwd(), "public/articles");
  const files = fs.readdirSync(newsDirectory);

  const paths = files
    .map((file) => file.replace(/\.(ru|de)\.md$/, ""))
    .filter((slug, index, self) => self.indexOf(slug) === index)
    .flatMap((slug) => [
      { params: { slug }, locale: "ru" },
      { params: { slug }, locale: "de" },
    ]);

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ArticleProps> = async ({ params, locale }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const filePath = path.join(process.cwd(), "public/articles", `${params.slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(content);

  return {
    props: {
      article: {
        id: data.id || 0,
        slug: params.slug as string,
        title: data.title || "",
        shortTitle: data.shortTitle || null,
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        author: data.author || "",
        image: data.image || null,
        imageAlt: data.imageAlt || "",
        content: processedContent.toString(),
      },
    },
    revalidate: 600,
  };
};
