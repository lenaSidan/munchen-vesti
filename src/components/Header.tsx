import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import useTranslation from "@/hooks/useTranslation";

export default function Header() {
  const t = useTranslation();
  const router = useRouter();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen((prev) => !prev);
  };

  const closeSubmenu = () => {
    setIsSubmenuOpen(false);
  };

  // Закрытие подменю при смене маршрута
  useEffect(() => {
    closeSubmenu();
  }, [router.pathname]);

  // Проверка активен ли какой-либо подпункт меню
  const isAdsActive = router.pathname.startsWith("/ads");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.containerBackground}>
          <Link href="/" className={styles.logo}>
            {t("home.title")}
          </Link>
          <div className={styles.tools}>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/articles-page"
            className={`${styles.navLink} ${router.pathname === "/articles-page" ? styles.active : ""}`}
            onClick={closeSubmenu}
          >
            {t("menu.articles")}
          </Link>

          <Link
            href="/events-page"
            className={`${styles.navLink} ${router.pathname === "/events-page" ? styles.active : ""}`}
            onClick={closeSubmenu}
          >
            {t("menu.announcements")}
          </Link>

          <div className={styles.dropdownWrapper}>
            <button type="button"
              onClick={toggleSubmenu}
              className={`${styles.navLink} ${isAdsActive ? styles.active : ""}`}
            >
              {t("menu.ads").toUpperCase()}
            </button>

            {isSubmenuOpen && (
              <div className={styles.submenu}>
                <Link href="/adsServices-page" className={styles.submenuLink} onClick={closeSubmenu}>
                  {t("menu.ads_services")}
                </Link>
                <Link href="/adsFood-page" className={styles.submenuLink} onClick={closeSubmenu}>
                  {t("menu.ads_food")}
                </Link>
                <Link href="/adsStudios-page" className={styles.submenuLink} onClick={closeSubmenu}>
                  {t("menu.ads_studios")}
                </Link>
                <Link href="/adsOther-page" className={styles.submenuLink} onClick={closeSubmenu}>
                  {t("menu.ads_other")}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className={styles.decorativeLine}>
        <span className={styles.left}>❧</span>
        <span className={styles.right}>❧</span>
      </div>
    </header>
  );
}
