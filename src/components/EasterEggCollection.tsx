import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/EasterEggCollection.module.css";
import useTranslation from "@/hooks/useTranslation";
import { EASTER_EGGS } from "@/data/easterEggs";
import ScrollModal from "./ScrollModal";
import Link from "next/link";

const CURRENT_VERSION = "v3";

export default function EasterEggCollection() {
  const t = useTranslation();
  const [found, setFound] = useState<string[]>([]);
  const [rareMap, setRareMap] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const updateCollection = () => {
      const foundEggs = EASTER_EGGS.filter(
        (egg) =>
          egg.version === CURRENT_VERSION &&
          localStorage.getItem(`${egg.id}-${CURRENT_VERSION}`) === "true"
      ).map((egg) => egg.id);

      const tempRareMap: Record<string, boolean> = {};
      foundEggs.forEach((id) => {
        const isRare = localStorage.getItem(`${id}-${CURRENT_VERSION}-rare`) === "true";
        tempRareMap[id] = isRare;
      });

      setFound(foundEggs);
      setRareMap(tempRareMap);
      setIsLoaded(true);

      const allNormalFound = EASTER_EGGS.filter(
        (egg) => egg.version === CURRENT_VERSION && !egg.secret
      ).every((egg) => foundEggs.includes(egg.id));

      if (allNormalFound && !localStorage.getItem(`easteregg-secret-${CURRENT_VERSION}`)) {
        localStorage.setItem(`easteregg-secret-${CURRENT_VERSION}`, "true");
        setFound((prev) => [...prev, "easteregg-secret"]);
      }
    };

    updateCollection();
    window.addEventListener("easteregg-found", updateCollection);
    return () => window.removeEventListener("easteregg-found", updateCollection);
  }, []);

  const allNormalFound = EASTER_EGGS.filter(
    (egg) => egg.version === CURRENT_VERSION && !egg.secret
  ).every((egg) => found.includes(egg.id));

  const visibleEggs = [
    ...EASTER_EGGS.filter((egg) => egg.version === CURRENT_VERSION && !egg.secret),
    ...EASTER_EGGS.filter((egg) => egg.version === CURRENT_VERSION && egg.secret && allNormalFound),
  ];

  const foundCount = found.filter((id) => visibleEggs.some((egg) => egg.id === id)).length;

  if (!isLoaded) return null;

  return (
    <div className={`${styles.collectionWrapper} ${allNormalFound ? styles.allFound : ""}`}>
      <h1 className={styles.title}>{t("eastereggCollection.title")}</h1>
      <p className={styles.subtitle}>
        {t("eastereggCollection.foundMain", {
          count: Math.min(foundCount, 3).toString(),
        })}
      </p>

      {allNormalFound && (
        <>
          <p className={styles.bonus}>{t("eastereggCollection.bonusMessage")}</p>
          <p className={styles.achievement}>{t("eastereggCollection.allFound")}</p>
        </>
      )}

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
                // Сразу сохраняем, что подарок получен
                localStorage.setItem(`easteregg-reward-claimed-${CURRENT_VERSION}`, "true");
                window.dispatchEvent(new Event("easteregg-found"));
                setShowScroll(true);
              }
            }}
          >
            {found.includes(egg.id) ? (
              <>
                <Image
                  src={(rareMap[egg.id] ? egg.rareImage : egg.image) ?? egg.image}
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
