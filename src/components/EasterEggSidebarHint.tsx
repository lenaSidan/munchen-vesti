import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/EasterEggSidebarHint.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function EasterEggSidebarHint() {
  const t = useTranslation();
  const [isHidden, setIsHidden] = useState(false);
  const [hasEggs, setHasEggs] = useState(false);

  useEffect(() => {
    const checkEggs = () => {
      if (typeof window === "undefined") return;
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("easteregg-"));
      const found = keys.some((key) => localStorage.getItem(key) === "true");
      setHasEggs(found);
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
            <span className={styles.verticalText}> {t("footer.collection")}</span>
          </Link>
        </div>
      )}

      {isHidden && (
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
