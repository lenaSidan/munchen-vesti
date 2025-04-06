import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Ads.module.css";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import NewsBlock from "./NewsBlock";
import { NewsItem } from "@/lib/getNewsByLocale";

export default function ShortNewsBlock() {
  const t = useTranslation();
  const { locale } = useRouter();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch(`/api/news-short?locale=${locale}`);
      const data = await res.json();
      setNewsList(data);
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
      <NewsBlock newsList={newsList} />
    </aside>
  );
}
