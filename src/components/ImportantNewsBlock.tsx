import importantNews from "@/data/importantNews.json";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/ImportantNews.module.css";
// import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: string;
  titleKey: string;
  textKey: string;
  image?: string;
  link?: string;
}

export default function ImportantNewsBlock() {
  const t = useTranslation();

  return (
    <section className={styles.importantNewsSection}>
    
      <ul className={styles.newsList}>
        {importantNews.map((item: NewsItem) => {
          return (
            <li key={item.id} className={styles.newsItem}>
              {/* {item.image && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image}
                    alt="News image"
                    width={100}
                    height={100}
                    loading="lazy"
                  />
                </div>
              )} */}
              <div className={styles.textWrapper}>
                <h3 className={styles.newsTitle}>{t("important_news.subTitle")}</h3>

                <p className={styles.newSubtitle}>{t("important_news.subTitle2")}</p>
                <p className={styles.newsText}>{t("important_news.text1")}</p>
                <p className={styles.newsUlText}>{t("important_news.ul")}</p>
                <ul className={styles.newsUl}>
                  <li className={styles.newsLi}>{t("important_news.li1")}</li>
                  <li className={styles.newsLi}>{t("important_news.li2")}</li>
                  <li className={styles.newsLi}>{t("important_news.li3")}</li>
                  <li className={styles.newsLi}>{t("important_news.li4")}</li>
                </ul>
                <p className={styles.newsData}>{t("important_news.data")}</p>
                {item.link && (
                 <p className={styles.linkWrapper}>
                 <Link href={item.link} target="_blank" rel="noopener noreferrer">
                   {t("important_news.visit_tiktok")}
                 </Link>
               </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
