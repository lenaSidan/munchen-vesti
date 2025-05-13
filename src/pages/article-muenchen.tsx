import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Event.module.css";
import Link from "next/link";

export default function ArticleMuenchen() {
  const t = useTranslation();

  return (
    <>
      <Seo
        title={t("seo.article_muenchen_title")}
        description={t("seo.article_muenchen_description")}
      />

      <div className={styles.articleContainer}>
        <h1 className={styles.title}>{t("articleSEO.h1")}</h1>

        <p className={styles.meta}>München, 2025</p>

        <div className={styles.content}>
          <p>{t("articleSEO.paragraph1")}</p>
          <p>{t("articleSEO.paragraph2")}</p>
          <p>{t("articleSEO.paragraph3")}</p>
        </div>

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/articles-page" className={styles.readMore}>
            {t("articleSEO.link_text")}
          </Link>
          <div className={`${styles.decorativeLine} ${styles.bottom}`}>
            <span className={styles.right}>⊱❧</span>
            <span className={styles.left}>⊱❧</span>
          </div>
        </div>
      </div>
    </>
  );
}
