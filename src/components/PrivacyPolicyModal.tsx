import { useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/PrivacyPolicyModal.module.css";

export default function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  const t = useTranslation();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{t("privacy_policy.title")}</h3>
        <p className={styles.updated}>
          {t("privacy_policy.last_updated").replace("{{date}}", new Date().toLocaleDateString("de-DE"))}
        </p>

        <p>{t("privacy_policy.intro")}</p>

        <h4>{t("privacy_policy.data_collection")}</h4>
        <p>{t("privacy_policy.data_collection_desc")}</p>

        <h4>{t("privacy_policy.cookies")}</h4>
        <p>{t("privacy_policy.cookies_desc")}</p>

        <h4>{t("privacy_policy.data_usage")}</h4>
        <p>{t("privacy_policy.data_usage_desc")}</p>

        <h4>{t("privacy_policy.manage_cookies")}</h4>
        <p>{t("privacy_policy.manage_cookies_desc")}</p>

        <h4>{t("privacy_policy.updates")}</h4>
        <p>{t("privacy_policy.updates_desc")}</p>

        <button type="button" onClick={onClose} className={styles.closeButton}>
          {t("privacy_policy.close")}
        </button>
      </div>
    </div>
  );
}
