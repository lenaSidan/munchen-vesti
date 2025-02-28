import { useRouter } from "next/router";
import styles from "@/styles/LanguageSwitcher.module.css";
import { useState, useEffect } from "react";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, pathname, query } = router;
  const [isRu, setIsRu] = useState(locale === "ru");

  useEffect(() => {
    setIsRu(locale === "ru");
  }, [locale]);

  const toggleLanguage = () => {
    const newLang = isRu ? "de" : "ru";
    router.push({ pathname, query }, undefined, { locale: newLang });
    setIsRu(!isRu);
  };

  return (
    <div className={styles.languageSwitcher}>
      <span className={styles.languageLabel}>{isRu ? "Рус" : "De"}</span>
      <div
        className={`${styles.toggleWrapper} ${isRu ? "" : styles.active}`}
        onClick={toggleLanguage}
      >
        <div className={styles.toggleKnob}></div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
