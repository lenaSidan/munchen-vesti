import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/EasterEggCollection.module.css";
import useTranslation from "@/hooks/useTranslation";
import { EASTER_EGGS } from "@/data/easterEggs";
import ScrollModal from "./ScrollModal";
import Link from "next/link";

export default function EasterEggCollection() {
  const t = useTranslation();
  const [found, setFound] = useState<string[]>([]);
  const [rareMap, setRareMap] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Загружаем найденные пасхалки + проверяем, все ли найдены
  useEffect(() => {
    const updateCollection = () => {
      const foundEggs = EASTER_EGGS.filter((egg) => localStorage.getItem(egg.id) === "true").map((egg) => egg.id);
      const tempRareMap: Record<string, boolean> = {};
      foundEggs.forEach((id) => {
        const isRare = localStorage.getItem(`${id}-rare`) === "true";
        tempRareMap[id] = isRare;
      });

      setFound(foundEggs);
      setRareMap(tempRareMap);
      setIsLoaded(true);

      const allFound = EASTER_EGGS.filter((egg) => !egg.secret).every((egg) => foundEggs.includes(egg.id));
      if (allFound) {
        localStorage.setItem("easteregg-secret", "true");
        window.dispatchEvent(new Event("easteregg-found"));
      }
    };

    updateCollection();
  }, []);

  const isAllFound = EASTER_EGGS.filter((egg) => !egg.secret).every((egg) => found.includes(egg.id));

  // Показываем все, кроме секретной — она появляется только если собраны все обычные
  const visibleEggs = EASTER_EGGS.filter((egg) => !egg.secret || isAllFound);
  const foundCount = found.filter((id) => visibleEggs.some((egg) => egg.id === id)).length;

  if (!isLoaded) return null;

  return (
    <div className={`${styles.collectionWrapper} ${isAllFound ? styles.allFound : ""}`}>
      <h1 className={styles.title}>{t("eastereggCollection.title")}</h1>
      <p className={styles.subtitle}>
        {t("eastereggCollection.foundMain", {
          count: Math.min(foundCount, 3).toString(),
        })}
      </p>

      {isAllFound && <p className={styles.bonus}>{t("eastereggCollection.bonusMessage")}</p>}
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
                <Image
                  src={rareMap[egg.id] && egg.rareImage ? egg.rareImage : egg.image}
                  alt={t(egg.nameKey)}
                  width={80}
                  height={80}
                  className={styles.eggImage}
                />
                {egg.secret && <span className={styles.giftMark}>{t("eastereggCollection.gift")}</span>}
                <p>{t(egg.nameKey)}</p>
                {rareMap[egg.id] && <span className={styles.rareMark}>{t("eastereggCollection.rare")}</span>}
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

      <div className={styles.backButtonWrapper}>
        <Link href="/" className={styles.backButton}>
          ⬅ {t("eastereggCollection.backToHome")}
        </Link>
      </div>
    </div>
  );
}
