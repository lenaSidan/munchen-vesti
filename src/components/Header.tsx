import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileHeader from "@/components/MobileHeader";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const t = useTranslation();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const [isAdsSubmenuOpen, setIsAdsSubmenuOpen] = useState(false);
  const [isWordsSubmenuOpen, setIsWordsSubmenuOpen] = useState(false);

  const adsRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  const [foundCount, setFoundCount] = useState(0);
  const [allFound, setAllFound] = useState(false);
  const CURRENT_EGG_VERSION = "v3";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        adsRef.current &&
        !adsRef.current.contains(target) &&
        !document.getElementById("adsButton")?.contains(target)
      ) {
        setIsAdsSubmenuOpen(false);
      }

      if (
        wordsRef.current &&
        !wordsRef.current.contains(target) &&
        !document.getElementById("wordsButton")?.contains(target)
      ) {
        setIsWordsSubmenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAdsSubmenu = () => {
    setIsAdsSubmenuOpen((prev) => !prev);
    setIsWordsSubmenuOpen(false);
  };

  const toggleWordsSubmenu = () => {
    setIsWordsSubmenuOpen((prev) => !prev);
    setIsAdsSubmenuOpen(false);
  };

  useEffect(() => {
    setIsAdsSubmenuOpen(false);
    setIsWordsSubmenuOpen(false);
  }, [router.pathname]);

  const adsRoutes = ["/services-page", "/gastronomy-page", "/education-page", "/other-page"];
  const wordsRoutes = ["/oldwords-page", "/bavarian-words", "/proverbs-page"];

  const isAdsActive = adsRoutes.includes(router.pathname);
  const isWordsActive = wordsRoutes.includes(router.pathname);
  const isAnySubmenuOpen = isAdsSubmenuOpen || isWordsSubmenuOpen;

  const isAdsHighlighted = isAdsSubmenuOpen || (!isAnySubmenuOpen && isAdsActive);
  const isWordsHighlighted = isWordsSubmenuOpen || (!isAnySubmenuOpen && isWordsActive);



  const monthName = new Date()
    .toLocaleString(router.locale || "ru", { month: "long" })
    .replace(/^./, (str) => str.toUpperCase());

  const year = new Date().getFullYear();

  if (isMobile) return <MobileHeader />;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.containerBackground}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoBox}>
              <div className={styles.logoDataBox}>
                <Image
                  src="/icons/logo.png"
                  alt="logo Munich News"
                  width={80}
                  height={80}
                  priority
                  className={`${styles.logoIcon} ${styles.logoTheme}`}
                />
                <p className={styles.logoDate}>
                  {t("home.edition_date")
                    .replace("{{month}}", monthName)
                    .replace("{{year}}", year.toString())}
                </p>
              </div>
              <div className={styles.titleBox}>
                <span className={styles.logoText}>{t("home.title")}</span>
                <p className={styles.logoSince}>{t("home.published_fixed")}</p>
              </div>
            </div>
          </Link>

          <div className={styles.tools}>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/articles-page"
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/articles-page"
                ? styles.active
                : ""
            }`}
          >
            {t("menu.articles")}
          </Link>

          <Link
            href="/events-page"
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/events-page"
                ? styles.active
                : ""
            }`}
          >
            {t("menu.announcements")}
          </Link>

          <Link
            href="/news-page"
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/news-page"
                ? styles.active
                : ""
            }`}
          >
            {t("menu.news")}
          </Link>

          <div className={styles.dropdownWrapper}>
            <button
              id="adsButton"
              type="button"
              onClick={toggleAdsSubmenu}
              className={`${styles.navLink} ${isAdsHighlighted ? styles.active : ""}`}
            >
              {t("menu.ads").toUpperCase()}
            </button>

            {isAdsSubmenuOpen && (
              <div className={styles.submenu} ref={adsRef}>
                <Link href="/services-page" className={styles.submenuLink}>
                  {t("menu.ads_services")}
                </Link>
                <Link href="/gastronomy-page" className={styles.submenuLink}>
                  {t("menu.ads_food")}
                </Link>
                <Link href="/education-page" className={styles.submenuLink}>
                  {t("menu.ads_studios")}
                </Link>
                <Link href="/other-page" className={styles.submenuLink}>
                  {t("menu.ads_other")}
                </Link>
              </div>
            )}
          </div>

          <div className={styles.dropdownWrapper}>
            <button
              id="wordsButton"
              type="button"
              onClick={toggleWordsSubmenu}
              className={`${styles.navLink} ${isWordsHighlighted ? styles.active : ""}`}
            >
              {t("menu.words").toUpperCase()}
            </button>

            {isWordsSubmenuOpen && (
              <div className={styles.submenuWords} ref={wordsRef}>
                <Link href="/oldwords-page" className={styles.submenuLink}>
                  {t("menu.old_words")}
                </Link>
                <Link href="/bavarian-words" className={styles.submenuLink}>
                  {t("menu.bavarian_words")}
                </Link>
                 <Link href="/proverbs-page" className={styles.submenuLink}>
                  {t("menu.proverbs_words")}
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/postcards-page"
            title={t("menu.chronicles_full")}
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/postcards-page"
                ? styles.active
                : ""
            }`}
          >
            {t("menu.chronicles").toUpperCase()}
          </Link>
          <Link
            href="/geocaching-page"
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/geocaching-page"
                ? styles.active
                : ""
            }`}
          >
            {t("menu.geocaching")}
          </Link>
          <Link
            href="/places-page"
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/places-page"
                ? styles.active
                : ""
            }`}
          >
            {t("menu.places")}
          </Link>
           <Link
            href="/useful-page"
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/useful-page"
                ? styles.active
                : ""
            }`}
          >
            
            {t("menu.useful")}
          </Link>
          {/* <Link
            href="/events"
            className={`${styles.navLink} ${
              !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/events"
                ? styles.active
                : ""
            }`}
          >
            {t("menu.events")}
          </Link> */}
          {/* {foundCount > 0 && !allFound && (
            <Link
              href="/collection"
              className={`${styles.navLink} ${
                !isAdsSubmenuOpen && !isWordsSubmenuOpen && router.pathname === "/collection"
                  ? styles.active
                  : ""
              } ${styles.highlighted}`}
            >
              {t("footer.collection")}
            </Link>
          )} */}
        </nav>
      </div>

      <div className={styles.decorativeLine}>
        <span className={styles.left}>❧</span>
        <span className={styles.right}>❧</span>
      </div>
    </header>
  );
}
