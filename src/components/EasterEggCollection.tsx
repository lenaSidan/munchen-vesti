import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/EasterEggCollection.module.css";
import useTranslation from "@/hooks/useTranslation";
import { EASTER_EGGS } from "@/data/easterEggs";
import ScrollModal from "./ScrollModal";

export default function EasterEggCollection() {
  const t = useTranslation();
  const [found, setFound] = useState<string[]>([]);
  const [showScroll, setShowScroll] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загружаем найденные пасхалки
  useEffect(() => {
    const foundEggs = EASTER_EGGS.filter((egg) => localStorage.getItem(egg.id) === "true").map((egg) => egg.id);
    setFound(foundEggs);
    setIsLoaded(true);
    if (EASTER_EGGS.filter((egg) => !egg.secret).every((egg) => localStorage.getItem(egg.id) === "true")) {
      localStorage.setItem("easteregg-secret", "true");
    }
  }, []);

  const isAllFound = EASTER_EGGS.filter((egg) => !egg.secret).every((egg) => found.includes(egg.id));

  // Показываем все, кроме секретной. Секретная появляется только если собраны все обычные.
  const visibleEggs = EASTER_EGGS.filter((egg) => !egg.secret || isAllFound);

  const total = visibleEggs.length;
  const foundCount = found.filter((id) => visibleEggs.some((egg) => egg.id === id)).length;

  if (!isLoaded) return null;

  return (
    <div className={`${styles.collectionWrapper} ${isAllFound ? styles.allFound : ""}`}>
      <h1 className={styles.title}>{t("eastereggCollection.title")}</h1>
      <p className={styles.subtitle}>
        {t("eastereggCollection.found", {
          count: foundCount.toString(),
          total: total.toString(),
        })}
      </p>

      {isAllFound && <p className={styles.achievement}>{t("eastereggCollection.allFound")}</p>}
      {showScroll && <ScrollModal onClose={() => setShowScroll(false)} />}

      <div className={styles.grid}>
        {visibleEggs.map((egg) => (
          <div
            key={egg.id}
            className={`
            ${styles.card} 
            ${found.includes(egg.id) ? styles.found : styles.locked} 
            ${egg.secret && found.includes(egg.id) ? styles.clickable : ""} 
            ${egg.secret && found.includes(egg.id) ? styles.specialGlow : ""}
          `}
            onClick={() => {
              if (egg.secret && found.includes(egg.id)) {
                setShowScroll(true);
              }
            }}
          >
            {found.includes(egg.id) ? (
              <>
                <Image src={egg.image} alt={t(egg.nameKey)} width={80} height={80} className={styles.eggImage} />
                <p>{t(egg.nameKey)}</p>
                {egg.rare && <span className={styles.rareMark}>{t("eastereggCollection.rare")}</span>}
              </>
            ) : (
              <>
                <div className={styles.placeholder}></div>
                <p>{t("eastereggCollection.unknown")}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
