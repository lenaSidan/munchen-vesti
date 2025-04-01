import useTranslation from "@/hooks/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "@/styles/About.module.css";

export default function About() {
  const t = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {t("meta.about_title")} – {t("meta.default_title")}
        </title>
        <meta name="description" content={t("meta.about_description")} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t("meta.about_title")} />
        <meta property="og:description" content={t("meta.about_description")} />
        <meta property="og:image" content="/default-og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://munchen-vesti.de${router.asPath}`} />
      </Head>

      <div className={styles.container}>
        <h3 className={styles.title}>{t("about.title")}</h3>

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
    </>
  );
}
