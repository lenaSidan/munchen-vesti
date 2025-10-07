import useTranslation from "@/hooks/useTranslation";
import { NewsItem } from "@/lib/getNews";
import styles from "@/styles/ShortNews.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NewsBlock from "./NewsBlock";

// 🔹 Интерфейс пропсов
interface ShortNewsBlockProps {
  limit?: number; // по умолчанию будет 2
}

// 🔹 Функция для случайного выбора новостей
function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function ShortNewsBlock({ limit = 2 }: ShortNewsBlockProps) {
  const t = useTranslation();
  const { locale } = useRouter();
  const [randomNews, setRandomNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news-short?locale=${locale}`);
        const data: NewsItem[] = await res.json();
        const selected = getRandomItems(data, limit); // 🟢 теперь используем limit из пропсов
        setRandomNews(selected);
      } catch (err) {
        console.error("Ошибка загрузки коротких новостей:", err);
      }
    };

    fetchNews();
  }, [locale, limit]);

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

      {/* 🔹 Передаём список выбранных новостей */}
      <NewsBlock newsList={randomNews} />
    </aside>
  );
}
