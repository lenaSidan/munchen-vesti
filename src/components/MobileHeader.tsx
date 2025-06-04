import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/mobileHeader.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function MobileHeader() {
  const t = useTranslation();
  const router = useRouter();

  const [isAdsSubmenuOpen, setIsAdsSubmenuOpen] = useState(false);
  const [isWordsSubmenuOpen, setIsWordsSubmenuOpen] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [allFound, setAllFound] = useState(false);
  const CURRENT_EGG_VERSION = "v3";

  const adsSubmenuRef = useRef<HTMLDivElement>(null);
  const wordsSubmenuRef = useRef<HTMLDivElement>(null);

  const adsRoutes = ["/services-page", "/gastronomy-page", "/education-page", "/other-page"];
  const isAdsActive = adsRoutes.includes(router.pathname);
  const isWordsActive = ["/oldwords-page", "/bavarian-words"].includes(router.pathname);
  const isAnySubmenuOpen = isAdsSubmenuOpen || isWordsSubmenuOpen;

  const closeAllSubmenus = () => {
    setIsAdsSubmenuOpen(false);
    setIsWordsSubmenuOpen(false);
  };

  const handleAdsClick = () => {
    setIsAdsSubmenuOpen((prev) => !prev);
    setIsWordsSubmenuOpen(false);
  };

  const handleWordsClick = () => {
    setIsWordsSubmenuOpen((prev) => !prev);
    setIsAdsSubmenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        !adsSubmenuRef.current?.contains(target) &&
        !wordsSubmenuRef.current?.contains(target) &&
        !document.getElementById("adsMenuButton")?.contains(target) &&
        !document.getElementById("wordsMenuButton")?.contains(target)
      ) {
        closeAllSubmenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkEggs = () => {
      if (typeof window === "undefined") return;

      const keys = Object.keys(localStorage).filter(
        (key) => key.startsWith("easteregg-") && !key.includes("reward") && !key.includes("-rare")
      );
      const count = keys.filter((key) => localStorage.getItem(key) === "true").length;
      const rewardClaimed =
        localStorage.getItem(`easteregg-reward-claimed-${CURRENT_EGG_VERSION}`) === "true";

      setFoundCount(count);
      setAllFound(rewardClaimed);
    };

    checkEggs();
    window.addEventListener("easteregg-found", checkEggs);
    return () => window.removeEventListener("easteregg-found", checkEggs);
  }, []);

  return (
    <header className={styles.mobileHeader}>
      <div className={styles.container}>
        <div className={styles.fullBackground}>
          <div className={styles.topRow}>
            <div className={styles.containerBackground}>
              <Link href="/" className={styles.logoLink}>
                <div className={styles.logoBox}>
                  <div className={styles.titleBox}>
                    <span className={styles.logoText}>{t("home.title")}</span>
                  </div>
                </div>
              </Link>

              <div className={styles.tools}>
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.fadeLeft} />
          <div className={styles.fadeRight} />
          <div className={styles.menuWrapper}>
            <div className={styles.menuMain}>
              <Link
                href="/articles-page"
                className={`${styles.navLink} ${!isAnySubmenuOpen && router.pathname === "/articles-page" ? styles.active : ""}`}
                onClick={closeAllSubmenus}
              >
                {t("menu.articles").toUpperCase()}
              </Link>

              <Link
                href="/events-page"
                className={`${styles.navLink} ${!isAnySubmenuOpen && router.pathname === "/events-page" ? styles.active : ""}`}
                onClick={closeAllSubmenus}
              >
                {t("menu.announcements").toUpperCase()}
              </Link>

              <Link
                href="/news-page"
                className={`${styles.navLink} ${!isAnySubmenuOpen && router.pathname === "/news-page" ? styles.active : ""}`}
                onClick={closeAllSubmenus}
              >
                {t("menu.news").toUpperCase()}
              </Link>

              <button
                id="adsMenuButton"
                type="button"
                onClick={handleAdsClick}
                className={`${styles.navLink} ${isAdsSubmenuOpen || (!isAnySubmenuOpen && isAdsActive) ? styles.active : ""}`}
              >
                {t("menu.ads").toUpperCase()}
              </button>

              <button
                id="wordsMenuButton"
                type="button"
                onClick={handleWordsClick}
                className={`${styles.navLink} ${isWordsSubmenuOpen || (!isAnySubmenuOpen && isWordsActive) ? styles.active : ""}`}
              >
                {t("menu.words").toUpperCase()}
              </button>

              <Link
                href="/postcards-page"
                title={t("menu.chronicles_full")}
                className={`${styles.navLink} ${!isAnySubmenuOpen && router.pathname === "/postcards-page" ? styles.active : ""}`}
                onClick={closeAllSubmenus}
              >
                {t("menu.chronicles").toUpperCase()}
              </Link>
              <Link
                href="/geocaching-page"
                title={t("menu.chronicles_full")}
                className={`${styles.navLink} ${!isAnySubmenuOpen && router.pathname === "/geocaching-page" ? styles.active : ""}`}
                onClick={closeAllSubmenus}
              >
                {t("menu.geocaching").toUpperCase()}
              </Link>
              <Link
                href="/events"
                className={`${styles.navLink} ${!isAnySubmenuOpen && router.pathname === "/events" ? styles.active : ""}`}
                onClick={closeAllSubmenus}
              >
                {t("menu.events").toUpperCase()}
              </Link>

              {/* {foundCount > 0 && !allFound && (
                <Link
                  href="/collection"
                  className={`${styles.navLink} ${!isAnySubmenuOpen && router.pathname === "/collection" ? styles.active : ""} ${styles.highlighted}`}
                  onClick={closeAllSubmenus}
                >
                  {t("footer.collection").toUpperCase()}
                </Link>
              )} */}
            </div>
          </div>

          {isAdsSubmenuOpen && (
            <div className={styles.submenu} ref={adsSubmenuRef}>
              <Link href="/services-page" className={styles.submenuLink} onClick={closeAllSubmenus}>
                {t("menu.ads_services")}
              </Link>
              <Link
                href="/gastronomy-page"
                className={styles.submenuLink}
                onClick={closeAllSubmenus}
              >
                {t("menu.ads_food")}
              </Link>
              <Link
                href="/education-page"
                className={styles.submenuLink}
                onClick={closeAllSubmenus}
              >
                {t("menu.ads_studios")}
              </Link>
              <Link href="/other-page" className={styles.submenuLink} onClick={closeAllSubmenus}>
                {t("menu.ads_other")}
              </Link>
            </div>
          )}

          {isWordsSubmenuOpen && (
            <div className={styles.submenu} ref={wordsSubmenuRef}>
              <Link href="/oldwords-page" className={styles.submenuLink} onClick={closeAllSubmenus}>
                {t("menu.old_words")}
              </Link>
              <Link
                href="/bavarian-words"
                className={styles.submenuLink}
                onClick={closeAllSubmenus}
              >
                {t("menu.bavarian_words")}
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className={styles.decorativeLine} />
    </header>
  );
}
