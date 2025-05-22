import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/ImportantNews.module.css";
import Image from "next/image";
import Link from "next/link";

export default function ImportantNewsBlock() {
  const t = useTranslation();

  return (
    <section className={styles.importantNewsSection}>
      <h3 className={styles.indexTitle}>{t("important_news.indexTitle")}</h3>
      <div className={styles.newsItem}>
        <div className={styles.textWrapper}>
          <div className={styles.block}>
            <div className={styles.blockLeft}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/images/train-munich-rome.webp"
                  alt="Frecciarossa"
                  width={500}
                  height={300}
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.blockRight}>
              <h4 className={styles.newsTitle}>{t("important_news.title")}</h4>
              <p className={styles.newSubtitle}>{t("important_news.subtitle")}</p>
              <p className={styles.newsText}>{t("important_news.text")}</p>
              <p className={styles.newsText2}>{t("important_news.text2")}</p>
              <div className={styles.linkWrapper}>
                <Link href="/news/munich-rome-train">{t("important_news.link_text")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
