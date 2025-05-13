import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Event.module.css";
import Link from "next/link";

export default function NachrichtenMuenchen() {
  const t = useTranslation();

  return (
    <>
      <Seo
        title={t("seo.nachrichten_muenchen_title")}
        description={t("seo.nachrichten_muenchen_description")}
      />

      <div className={styles.articleContainer}>
        <h1 className={styles.title}>{t("newsSEO.h1")}</h1>

        <p className={styles.meta}>{t("newsSEO.meta")}</p>
        <div className={styles.content}>
          <p>{t("newsSEO.paragraph1")}</p>
          <p>{t("newsSEO.paragraph2")}</p>
          <p>{t("newsSEO.paragraph3")}</p>
        </div>
        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/news-page" className={styles.readMore}>
            {t("newsSEO.link_text")}
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
