import router from "next/router";
import styles from "../styles/EasterEggModal.module.css";
import useTranslation from "@/hooks/useTranslation";

interface Props {
  onClose: () => void;
  count: number;
  onReset: () => void;
}

export default function EasterEggModal({ onClose, count, onReset }: Props) {
  const t = useTranslation();
  const handleGoToCollection = () => {
    router.push("/collection");
    onClose(); // закрыть модалку при переходе
  };

  const totalEggs = 3;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{t("easteregg.title")}</h2>
        <p className={styles.text1}>{t("easteregg.message")}</p>
        <p className={styles.text2}>{t("easteregg.counter", { count: count.toString() })}</p>

        {/* 🎉 Поздравление за все пасхалки */}
        {count >= 3 && (
          <p className={styles.congrats}>{t("easteregg.allFound")}</p>
        )}

        {/* Потайная кнопка */}
        {count >= totalEggs && (
          <div className={styles.secretReset}>
            <p>{t("easteregg.resetHint")}</p>
            <button type="button" onClick={onReset} className={styles.resetButton}>
              🗑 {t("easteregg.resetButton")}
            </button>
          </div>
        )}

        <button type="button" onClick={onClose} className={styles.closeButton}>
          {t("easteregg.close")}
        </button>
        <button type="button" onClick={handleGoToCollection} className={styles.collectionButton}>
            📜 {t("easteregg.viewCollection")}
          </button>
      </div>
    </div>
  );
}
