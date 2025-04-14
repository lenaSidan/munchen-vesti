import Link from "next/link";
import styles from "../styles/ScrollModal.module.css";
import useTranslation from "@/hooks/useTranslation";

interface Props {
  onClose: () => void;
  reward?: {
    text: string;
    amount?: string;
    link: string;
    buttonText: string;
  };
}

export default function ScrollModal({ onClose }: Props) {
  const t = useTranslation();

  const handleClose = () => {
    // Запоминаем, что пользователь нашёл секретную пасхалку
    localStorage.setItem("easteregg-secret", "true");

    // Закрываем модалку
    onClose();

    // Обновляем все слушатели (например, в Footer)
    window.dispatchEvent(new Event("easteregg-found"));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>📜 {t("eastereggCollection.secretName")}</h2>
        <p className={styles.message}>{t("eastereggCollection.scrollMessage")}</p>
        <p className={styles.message2}>{t("eastereggCollection.scrollMessage1")}</p>
        <Link href="/events/reiki-retreat" className={styles.rewardButton}>
        <span className={styles.summa}>{t("eastereggCollection.summa")}</span>
        </Link>
        <p className={styles.linkHint}>{t("eastereggCollection.clickHint")}</p>
        <p className={styles.message2}>{t("eastereggCollection.scrollMessage2")}</p>
        <button type="button" onClick={handleClose} className={styles.closeButton}>
          ✨ {t("easteregg.close")}
        </button>
       
      </div>
    </div>
  );
}
