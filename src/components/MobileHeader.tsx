import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/mobileHeader.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function MobileHeader() {
  const t = useTranslation();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmenuClick = () => {
    if (isSubmenuOpen) {
      closeSubmenu();
    } else {
      setIsSubmenuOpen(true);
    }
  };

  const closeSubmenu = () => {
    setIsSubmenuOpen(false);
  };
  const adsRoutes = ["/services-page", "/gastronomy-page", "/education-page", "/other-page"];
  const isAdsActive = adsRoutes.some((route) => router.asPath.startsWith(route));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        submenuRef.current &&
        !submenuRef.current.contains(target) &&
        !document.getElementById("adsMenuButton")?.contains(target)
      ) {
        closeSubmenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
                className={`${styles.navLink} ${router.pathname === "/articles-page" ? styles.active : ""}`}
                onClick={closeSubmenu}
              >
                {t("menu.articles").toUpperCase()}
              </Link>

              <Link
                href="/events-page"
                className={`${styles.navLink} ${router.pathname === "/events-page" ? styles.active : ""}`}
                onClick={closeSubmenu}
              >
                {t("menu.announcements").toUpperCase()}
              </Link>
              <Link
                href="/news-page"
                className={`${styles.navLink} ${router.pathname === "/news-page" ? styles.active : ""}`}
                onClick={closeSubmenu}
              >
                {t("menu.news").toUpperCase()}
              </Link>
              <button
                id="adsMenuButton"
                type="button"
                onClick={handleSubmenuClick}
                className={`${styles.navLink} ${isAdsActive || isSubmenuOpen ? styles.active : ""}`}
              >
                {t("menu.ads").toUpperCase()}
              </button>
              <Link
                href="/oldwords-page"
                title={t("menu.words_full")}
                className={`${styles.navLink} ${router.pathname === "/oldwords-page" ? styles.active : ""}`}
                onClick={closeSubmenu}
              >
                {t("menu.words").toUpperCase()}
              </Link>
              <Link
                href="/postcards-page"
                title={t("menu.chronicles_full")}
                className={`${styles.navLink} ${router.pathname === "/postcards-page" ? styles.active : ""}`}
                onClick={closeSubmenu}
              >
                {t("menu.chronicles").toUpperCase()}
              </Link>
            </div>
          </div>
          {isSubmenuOpen && (
            <div className={styles.submenu} ref={submenuRef}>
              <Link href="/services-page" className={styles.submenuLink} onClick={closeSubmenu}>
                {t("menu.ads_services")}
              </Link>
              <Link href="/gastronomy-page" className={styles.submenuLink} onClick={closeSubmenu}>
                {t("menu.ads_food")}
              </Link>
              <Link href="/education-page" className={styles.submenuLink} onClick={closeSubmenu}>
                {t("menu.ads_studios")}
              </Link>
              <Link href="/other-page" className={styles.submenuLink} onClick={closeSubmenu}>
                {t("menu.ads_other")}
              </Link>
            </div>
          )}
        </nav>
      </div>
      <div className={styles.decorativeLine}>
        {/* <span className={styles.left}>❧</span>
        <span className={styles.right}>❧</span> */}
      </div>
    </header>
  );
}
