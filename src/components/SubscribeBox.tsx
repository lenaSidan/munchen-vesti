import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/SubscribeBox.module.css";

export default function SubscribeBox() {
    const t = useTranslation();

  return (
    <div className={styles.subscribeBox}>
      <p className={styles.subscribeText}>{t("subscribe.text")}</p>
      <div className={styles.buttonBox}>
      <a
        href="https://t.me/munchen_vesti"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.subscribeButton}
      >
        {t("subscribe.buttonRU")}
      </a>
       <a
        href="https://t.me/muenchener_nachrichten"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.subscribeButton}
      >
        {t("subscribe.buttonDE")}
      </a>
      </div>
    </div>
  );
}
