import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/ShortNews.module.css";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import NewsBlock from "./NewsBlock";
import { NewsItem } from "@/lib/getNewsByLocale";

function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function ShortNewsBlock() {
  const t = useTranslation();
  const { locale } = useRouter();
  const [randomNews, setRandomNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch(`/api/news-short?locale=${locale}`);
      const data: NewsItem[] = await res.json();
      const selected = getRandomItems(data, 2); // выбираем 2 случайные новости
      setRandomNews(selected);
    };
    fetchNews();
  }, [locale]);

  return (
    <aside className={styles.announcements}>
      <div className={styles.announcementHeader}>
        <h3 className={styles.announcementTitle}>{t("newsTitle")}</h3>
        <Image
          src="/icons/info.png"
          alt="Info"
          width={20}
          height={20}
          className={`${styles.announcementIcon} ${styles.info}`}
        />
      </div>
      <div className={styles.decorativeLine}></div>
      <NewsBlock newsList={randomNews} />
    </aside>
  );
}
