import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm"; // Поддержка Markdown-таблиц, чекбоксов и заголовков
import remarkRehype from "remark-rehype"; // Преобразование Markdown в HTML AST
import rehypeStringify from "rehype-stringify"; // Преобразование AST в строку HTML
import Image from "next/image";
import styles from "@/styles/Article.module.css";
import { getArticlesByLocale } from "@/lib/getArticles";

interface Article {
  slug: string;
  title: string;
  date: string;
  author?: string;
  image?: string;
  content: string;
}

interface ArticleProps {
  article: Article;
}

export default function Article({ article }: ArticleProps) {
  return (
    <div className={styles.articleContainer}>
      <h2 className={styles.title}>{article.title}</h2>
      <p className={styles.meta}>
        {article.date} {article.author && `| ${article.author}`}
      </p>
      {article.image && (
        <div className={styles.imageWrapper}>
          <Image 
            src={article.image} 
            alt={article.title} 
            width={600} 
            height={400} 
            className={styles.image}
          />
        </div>
      )}
      <div 
        className={styles.content} 
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ruArticles = getArticlesByLocale("ru");
  const deArticles = getArticlesByLocale("de");

  const paths = [
    ...ruArticles.map((article) => ({ params: { slug: article.slug }, locale: "ru" })),
    ...deArticles.map((article) => ({ params: { slug: article.slug }, locale: "de" })),
  ];

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

  // 🔹 Улучшенный рендеринг Markdown с поддержкой GitHub-форматирования
  const processedContent = await remark()
    .use(remarkGfm) // Поддержка Markdown-таблиц, чекбоксов, заголовков
    .use(remarkRehype) // Преобразование Markdown в HTML AST
    .use(rehypeStringify) // Преобразование AST в строку HTML
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    props: {
      article: {
        slug: params.slug as string,
        title: data.title || "Без названия",
        date: data.date || "Неизвестная дата",
        author: data.author || "",
        image: data.image || null,
        content: contentHtml,
      },
    },
    revalidate: 600,
  };
};
