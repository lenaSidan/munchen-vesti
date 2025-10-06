import Seo from "@/components/Seo";
import SocialLinks from "@/components/SocialLinks";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import { getNewsByLocale, NewsItem } from "@/lib/getNews"; // ✅ вот это ключевой импорт
import styles from "@/styles/News.module.css";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

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

        <div className={styles.socialLinks}>
          <SocialLinks />
        </div>

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
                  <div dangerouslySetInnerHTML={{ __html: news.excerpt || "" }} />
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

        <SubscribeBox />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<NewsListProps> = async ({ locale }) => {
  const newsList = await getNewsByLocale(locale || "ru"); // ✅ исправлено

  return {
    props: { newsList },
    revalidate: 600, // ISR каждые 10 минут
  };
};
