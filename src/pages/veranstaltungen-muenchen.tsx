import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Event.module.css";
import Link from "next/link";

export default function VeranstaltungenMuenchen() {
  const t = useTranslation();

  return (
    <>
      <Seo
        title={t("seo.veranstaltungen_muenchen_title")}
        description={t("seo.veranstaltungen_muenchen_description")}
      />

      <div className={styles.articleContainer}>
        <h1 className={styles.title}>{t("eventSEO.h1")}</h1>

        <p className={styles.meta}>München, 2025</p> {/* Можешь убрать или перевести */}

        <div className={styles.content}>
          <p>{t("eventSEO.paragraph1")}</p>
          <p>{t("eventSEO.paragraph2")}</p>
          <p>{t("eventSEO.paragraph3")}</p>
        </div>

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/events" className={styles.readMore}>
            {t("eventSEO.link_text")}
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
