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

interface ArticlesArticle {
  id: number;
  slug: string;
  title: string;
  author?: string;
  image?: string;
  content: string;
}

interface ArticleProps {
  article: ArticlesArticle;
}

export default function ArticlesArticlePage({ article }: ArticleProps) {
  const t = useTranslation();

  return (
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
            <Image src={article.image} alt={article.title} width={800} height={300} className={styles.image} />
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
        id: data.id || 0, // 🆕 Теперь у нас есть id
        slug: params.slug as string,
        title: data.title || "Без названия",
        author: data.author || "",
        image: data.image || null,
        content: processedContent.toString(),
      },
    },
    revalidate: 600,
  };
};
