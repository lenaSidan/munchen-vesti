import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/PrivacyPolicy.module.css";
import Seo from "@/components/Seo";

export default function PrivacyPolicyPage() {
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.privacy_title")} description={t("meta.privacy_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.privacy_title")}</h1>

      <div className={styles.container}>
        <h2 className={styles.title}>{t("privacy_policy.title")}</h2>
        <p className={styles.updated}>
          {t("privacy_policy.last_updated").replace("{{date}}", new Date().toLocaleDateString("de-DE"))}
        </p>

        <p className={styles.paragraph}>{t("privacy_policy.intro")}</p>

        <h3 className={styles.sectionTitle}>{t("privacy_policy.data_collection")}</h3>
        <p className={styles.paragraph}>{t("privacy_policy.data_collection_desc")}</p>

        <h3 className={styles.sectionTitle}>{t("privacy_policy.cookies")}</h3>
        <p className={styles.paragraph}>{t("privacy_policy.cookies_desc")}</p>

        <h3 className={styles.sectionTitle}>{t("privacy_policy.data_usage")}</h3>
        <p className={styles.paragraph}>{t("privacy_policy.data_usage_desc")}</p>

        <h3 className={styles.sectionTitle}>{t("privacy_policy.manage_cookies")}</h3>
        <p className={styles.paragraph}>{t("privacy_policy.manage_cookies_desc")}</p>

        <h3 className={styles.sectionTitle}>{t("privacy_policy.updates")}</h3>
        <p className={styles.paragraph}>{t("privacy_policy.updates_desc")}</p>
      </div>
    </>
  );
}
