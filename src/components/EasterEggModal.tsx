import router from "next/router";
import styles from "../styles/EasterEggModal.module.css";
import useTranslation from "@/hooks/useTranslation";

interface Props {
  onClose: () => void;
  onReset: () => void;
  count: number;
  totalEggs: number;
  version: string;
}

export default function EasterEggModal({
  onClose,
  onReset,
  count,
  totalEggs,
  version,
}: Props) {
  const t = useTranslation();

  const handleGoToCollection = () => {
    if (allEggsFound) {
      localStorage.setItem(`easteregg-reward-claimed-${version}`, "true");
      window.dispatchEvent(new Event("easteregg-found"));
    }
  
    onClose();
    router.push("/collection");
  };

  const allEggsFound = count >= totalEggs;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{t("easteregg.title")}</h2>

        <p className={styles.text1}>
          {t("easteregg.message")}
        </p>

        <p className={styles.text2}>
          {t("easteregg.counter", { count: count.toString(), total: totalEggs.toString() })}
        </p>

        <p className={styles.text1}>
          {t("easteregg.message2")}
        </p>

        {/* Поздравление за нахождение всех яиц */}
        {allEggsFound && (
          <>
            <p className={styles.congrats}>
              {t("easteregg.allFound", { version })}
            </p>

            {/* Кнопка для секретного сброса */}
            <div className={styles.secretReset}>
              <p>{t("easteregg.resetHint")}</p>
              <button
                type="button"
                onClick={onReset}
                className={styles.resetButton}
              >
                🗑 {t("easteregg.resetButton")}
              </button>
            </div>
          </>
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            {t("easteregg.close")}
          </button>

          <button
            type="button"
            onClick={handleGoToCollection}
            className={styles.collectionButton}
          >
            📜 {t("easteregg.viewCollection")}
          </button>
        </div>
      </div>
    </div>
  );
}
