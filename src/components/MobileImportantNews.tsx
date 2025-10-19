import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/ActualNews.module.css";
import Image from "next/image";
import Link from "next/link";

export default function ActualNewsBlock() {
  const t = useTranslation();

  return (
    <section className={styles.importantNewsSection}>
      <h3 className={styles.indexTitle}>{t("actual_news.indexTitle")}</h3>
      <div className={styles.newsItem}>
        <div className={styles.textWrapper}>
          <div className={styles.block}>
            <div className={styles.blockLeft}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/images/espresso-monaco.webp"
                  alt="Espresso-Monaco"
                  width={500}
                  height={300}
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.blockRight}>
              <h4 className={styles.newsTitle}>{t("actual_news.title")}</h4>
              <p className={styles.newSubtitle}>{t("actual_news.subtitle")}</p>
              <p className={styles.newsText}>{t("actual_news.text")}</p>
              <p className={styles.newsText2}>{t("actual_news.text2")}</p>
              <div className={styles.linkWrapper}>
                <Link href="/events-page#espresso-monaco">{t("actual_news.link_text")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
