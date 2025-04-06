import { useRouter } from "next/router";
import Link from "next/link";
import { GetStaticProps } from "next";
import Image from "next/image";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import useTranslation from "@/hooks/useTranslation";
import Seo from "@/components/Seo";
import styles from "@/styles/News.module.css";

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
      <div className={styles.container}>
        <h3>{locale === "ru" ? "fffАктуальные новости" : "Aktuelle Nachrichten"}</h3>

        {newsList.map((news) => (
          <div key={news.slug} className={styles.card}>
            {news.image && (
              <Image src={news.image} alt={news.title} className={styles.image} width={400} height={200} />
            )}
            <div className={styles.content}>
              <h2>{news.title}</h2>
              {news.date && <p className={styles.date}>{new Date(news.date).toLocaleDateString(locale || "ru")}</p>}
              <p dangerouslySetInnerHTML={{ __html: news.excerpt }} />
              <Link href={`/news/${news.slug}`}>
                <button type="button" className={styles.readMore}>
                  {t("read_more")}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<NewsListProps> = async ({ locale }) => {
  const newsDir = path.join(process.cwd(), "public/news");
  const files = fs.readdirSync(newsDir).filter((file) => file.endsWith(`.${locale}.md`));

  const newsList: NewsItem[] = files.map((filename) => {
    const filePath = path.join(newsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const slug = filename.replace(`.${locale}.md`, "");

    const firstParagraph = content.split("\n").find((line) => line.trim().length > 0) || "";

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || "",
      image: data.image || "",
      excerpt: firstParagraph.slice(0, 120) + "...",
    };
  });

  return {
    props: {
      newsList,
    },
  };
};
