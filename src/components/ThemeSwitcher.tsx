import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/ThemeSwitcher.module.css";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <div className={styles.themeSwitcher}>
      <Image
        src={`/icons/flashlight-${theme}.png`}
        alt="Change of theme"
        width={85}
        height={131}
        className={styles.themeIcon}
      />
      <div className={`${styles.themeToggleWrapper} ${theme === "dark" ? styles.dark : ""}`} onClick={toggleTheme}>
        <div className={styles.themeToggleKnob}></div>
      </div>
    </div>
  );
}
