import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/About.module.css";

export default function About() {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("about.title")}</h2>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>{t("about.section1.title")}</h4>
        <p className={styles.paragraph}>{t("about.section1.text")}</p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>{t("about.section2.title")}</h4>
        <p className={styles.paragraph}>{t("about.section2.text")}</p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>{t("about.section3.title")}</h4>
        <p className={styles.paragraph}>{t("about.section3.text")}</p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>{t("about.section4.title")}</h4>
        <p className={styles.paragraph}>{t("about.section4.text")}</p>
      </section>
    </div>
  );
}
