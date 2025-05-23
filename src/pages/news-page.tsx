import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/News.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface NewsItem {
  slug: string;
  title: string;
  date?: string;
  image?: string;
  excerpt: string;
}

interface NewsListProps {
  newsList: NewsItem[];
}

export default function News({ newsList }: NewsListProps) {
  const t = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <Seo title={t("meta.news_title")} description={t("meta.news_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.newsAll_title")}</h1>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("news.title")}</h2>
        <div className={styles.newsGrid}>
          {newsList.map((news) => (
            <div key={news.slug} className={styles.card}>
              {news.image && (
                <Image
                  src={news.image}
                  alt={news.title}
                  className={styles.image}
                  width={300}
                  height={180}
                />
              )}
              <div className={styles.cardInner}>
                <div className={styles.content}>
                 
                  {news.date && (
                    <div className={styles.date}>
                      {new Date(news.date).toLocaleDateString(locale || "ru")}
                    </div>
                  )} 
                  <h3>{news.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: news.excerpt }} />
                </div>
                <Link href={`/news/${news.slug}`} className={styles.readMoreLink}>
                  <button type="button" className={styles.readMore}>
                    {t("read_more")}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Markdown to HTML helper
async function convertMarkdownToHtml(markdown: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return processed.toString();
}

export const getStaticProps: GetStaticProps<NewsListProps> = async ({ locale }) => {
  const newsDir = path.join(process.cwd(), "public/news");
  const files = fs.readdirSync(newsDir).filter((file) => file.endsWith(`.${locale}.md`));

  const newsList: NewsItem[] = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(newsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const slug = filename.replace(`.${locale}.md`, "");
      const firstParagraph = content.split("\n").find((line) => line.trim()) || "";
      const excerpt = await convertMarkdownToHtml(firstParagraph.slice(0, 200) + "...");

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "",
        image: data.image || "",
        excerpt,
      };
    })
  );

  // 🔽 Сортировка по дате (от новых к старым)
  newsList.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    props: {
      newsList,
    },
  };
};
