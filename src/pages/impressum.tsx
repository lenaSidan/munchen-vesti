import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Impressum.module.css";

export default function Impressum() {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("impressum.title")}</h2>

      <section>
        <h4 className={styles.sectionTitle}>{t("impressum.responsible.title")}</h4>
        <p className={styles.paragraph}>{t("impressum.responsible.name")}</p>
        <p className={styles.paragraph}>{t("impressum.responsible.address")}</p>
        <p className={styles.paragraph}>{t("impressum.responsible.email")}</p>
      </section>

      <section>
        <h4 className={styles.sectionTitle}>{t("impressum.disclaimer.title")}</h4>
        <p className={styles.paragraph}>{t("impressum.disclaimer.text")}</p>
      </section>

      <section>
        <h4 className={styles.sectionTitle}>{t("impressum.external_links.title")}</h4>
        <p className={styles.paragraph}>{t("impressum.external_links.text")}</p>
      </section>

      <section>
        <h4 className={styles.sectionTitle}>{t("impressum.copyright.title")}</h4>
        <p className={styles.paragraph}>{t("impressum.copyright.text")}</p>
      </section>
    </div>
  );
}
