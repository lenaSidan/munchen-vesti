import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/mobileHeader.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import useTranslation from "@/hooks/useTranslation";
import router from "next/router";

export default function MobileHeader() {
  const t = useTranslation();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => setIsSubmenuOpen((prev) => !prev);
  const closeSubmenu = () => {
    setIsSubmenuOpen(false);
  };

  useEffect(() => {
    closeSubmenu();
  }, []);

  const isAdsActive = router.pathname.startsWith("/ads");

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
            <button
              type="button"
              onClick={toggleSubmenu}
              className={`${styles.navLink} ${isAdsActive ? styles.active : ""}`}
            >
              {t("menu.ads").toUpperCase()}
            </button>
          </div>
          {isSubmenuOpen && (
            <div className={styles.submenu}>
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
        <span className={styles.left}>❧</span>
        <span className={styles.right}>❧</span>
      </div>
    </header>
  );
}
