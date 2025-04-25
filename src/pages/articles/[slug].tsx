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
import { getArticleJsonLd } from "@/lib/jsonld/articleJsonLd";
import PageHead from "../../components/PageHead";

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
  locale: string;
}

export default function ArticlesArticlePage({ article, locale }: ArticleProps) {
  const t = useTranslation();

  const fullUrl = `https://munchen-vesti.de/${locale}/articles/${article.slug}`;
  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}article/${article.slug}`;

  const jsonLd = getArticleJsonLd({
    title: article.title,
    description: article.seoDescription,
    url: fullUrl,
    image: article.image,
    author: article.author,
  });

  return (
    <>
      <PageHead
        title={(article.seoTitle || article.title) + " – " + t("meta.default_title")}
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

export const getStaticProps: GetStaticProps<ArticleProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) {
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
        image: data.image || "",
        imageAlt: data.imageAlt || "",
        content: processedContent.toString(),
      },
      locale,
    },
    revalidate: 600,
  };
};
