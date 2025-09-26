import useTranslation from "@/hooks/useTranslation";
import Seo from "@/components/Seo";
import styles from "@/styles/About.module.css";

export default function About() {
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.about_title")} description={t("meta.about_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.about_title")}</h1>

      <div className={styles.container}>
        <h2 className={styles.title}>{t("about.title")}</h2>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("about.section1.title")}</h3>
          <p className={styles.paragraph}>{t("about.section1.text")}</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("about.section2.title")}</h3>
          <p className={styles.paragraph}>{t("about.section2.text")}</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("about.section3.title")}</h3>
          <p className={styles.paragraph}>{t("about.section3.text")}</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("about.section4.title")}</h3>
          <p className={styles.paragraph}>{t("about.section4.text")}</p>
        </section>
         <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("about.section5.title")}</h3>
          <p className={styles.paragraph}>{t("about.section5.text")}</p>
        </section>
      </div>
    </>
  );
}
