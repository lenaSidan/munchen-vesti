import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/EasterEggSidebarHint.module.css";

const EASTER_EGG_VERSION = "v3"; // добавили версию

export default function EasterEggSidebarHint() {
  const t = useTranslation();
  const [isHidden, setIsHidden] = useState(false);
  const [hasEggs, setHasEggs] = useState(false);

  useEffect(() => {
    const checkEggs = () => {
      if (typeof window === "undefined") return;

      const rewardClaimed =
        localStorage.getItem(`easteregg-reward-claimed-${EASTER_EGG_VERSION}`) === "true";

      const foundAny = Object.keys(localStorage).some(
        (key) => key.endsWith(`-${EASTER_EGG_VERSION}`) && localStorage.getItem(key) === "true"
      );

      if (rewardClaimed) {
        setHasEggs(false);
        setIsHidden(true); // 👈 панель сразу прячется
      } else {
        setHasEggs(foundAny);
      }
    };

    checkEggs();
    window.addEventListener("easteregg-found", checkEggs);
    return () => window.removeEventListener("easteregg-found", checkEggs);
  }, []);

  if (!hasEggs && !isHidden) return null;

  return (
    <>
      {!isHidden && (
        <div className={styles.panel}>
          <button className={styles.closeButton} onClick={() => setIsHidden(true)}>
            ✕
          </button>
          <Link href="/collection" className={styles.panelLink}>
            <span className={styles.verticalText}>{t("footer.collection")}</span>
          </Link>
        </div>
      )}

      {isHidden && hasEggs && (
        <button
          onClick={() => setIsHidden(false)}
          className={styles.arrow}
          aria-label="Открыть панель коллекции"
          title="Коллекция"
        >
          ❮
        </button>
      )}
    </>
  );
}
