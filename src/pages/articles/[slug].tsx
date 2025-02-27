import { GetStaticProps, GetStaticPaths } from "next";
import { getArticlesByLocale } from "@/lib/getArticles";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Image from "next/image";
import styles from "@/styles/Article.module.css";

// Интерфейс для статьи
interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
  image: string;
  content: string;
}

interface ArticleProps {
  article: Article;
}

export default function Article({ article }: ArticleProps) {
  return (
    <div className={styles.articleContainer}>
      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.meta}>
        {article.date} | {article.author}
      </p>
      <div className={styles.imageWrapper}>
        <Image 
          src={article.image} 
          alt={article.title} 
          width={600} 
          height={400} 
          className={styles.image}
        />
      </div>
      <div 
        className={styles.content} 
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getArticlesByLocale("ru").map((article) => article.slug);

  const paths = slugs.flatMap((slug) => [
    { params: { slug }, locale: "ru" },
    { params: { slug }, locale: "de" },
  ]);

  return { paths, fallback: false };
};


export const getStaticProps: GetStaticProps<ArticleProps> = async ({ params, locale }) => {
  const filePath = path.join(process.cwd(), "public/articles", `${params?.slug}.${locale}.md`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      article: { slug: params?.slug as string, ...data, content: contentHtml } as Article,
    },
    revalidate: 600,
  };
};
