import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Impressum.module.css";

export default function Impressum() {
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.impressum_title")} description={t("meta.impressum_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.impressum_title")}</h1>

      <div className={styles.container}>
        <h2 className={styles.title}>{t("impressum.title")}</h2>

        <section>
          <h3 className={styles.sectionTitle}>{t("impressum.responsible.title")}</h3>
          <p className={styles.paragraph}>{t("impressum.responsible.name")}</p>
          <p className={styles.paragraph}>{t("impressum.responsible.address")}</p>
        </section>

        <section>
          <h3 className={styles.sectionTitle}>{t("impressum.disclaimer.title")}</h3>
          <p className={styles.paragraph}>{t("impressum.disclaimer.text")}</p>
        </section>

        <section>
          <h3 className={styles.sectionTitle}>{t("impressum.external_links.title")}</h3>
          <p className={styles.paragraph}>{t("impressum.external_links.text")}</p>
        </section>

        <section>
          <h3 className={styles.sectionTitle}>{t("impressum.copyright.title")}</h3>
          <p className={styles.paragraph}>{t("impressum.copyright.text")}</p>
        </section>

        <section className={styles.hinweis}>
          <span className={styles.hinweisTitle}>{t("impressum.hinweis.title")}:</span>{" "}
          <span className={styles.hinweisText}>{t("impressum.hinweis.text")}</span>
        </section>
      </div>
    </>
  );
}
