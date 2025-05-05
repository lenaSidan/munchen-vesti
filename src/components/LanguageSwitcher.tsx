import styles from "@/styles/LanguageSwitcher.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const lanternIcon = `/icons/lantern_${isRu ? "ru" : "de"}_${theme}.png`;
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    };

    updateTheme(); // инициализация

    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <div className={styles.languageSwitcher}>
      <Image
        src={lanternIcon}
        alt="Lantern icon"
        width={85}
        height={131}
        className={styles.lanternIcon}
      />

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
