import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import useTranslation from "@/hooks/useTranslation";
import MobileHeader from "@/components/MobileHeader";

export default function Header() {
  const t = useTranslation();
  const router = useRouter();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // запустить при монтировании
    window.addEventListener("resize", handleResize); // отслеживание ресайза
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSubmenu = () => {
    setIsSubmenuOpen((prev) => !prev);
  };

  const closeSubmenu = () => {
    setIsSubmenuOpen(false);
  };

  useEffect(() => {
    closeSubmenu();
  }, [router.pathname]);

  const isAdsActive = router.pathname.startsWith("/ads");

  const monthName = new Date()
    .toLocaleString(router.locale || "ru", { month: "long" })
    .replace(/^./, (str) => str.toUpperCase());

  const year = new Date().getFullYear();

  if (isMobile) {
    return <MobileHeader />;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.containerBackground}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoBox}>
              <div className={styles.logoDataBox}>
                <Image
                  src="/icons/logo.png"
                  alt="Логотип Münchensкiя Вѣсти"
                  width={80}
                  height={80}
                  className={styles.logoIcon}
                />
                <p className={styles.logoDate}>
                  {t("home.edition_date").replace("{{month}}", monthName).replace("{{year}}", year.toString())}
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
            <button
              type="button"
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
