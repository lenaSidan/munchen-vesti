import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import useTranslation from "@/hooks/useTranslation";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Header() {
  const t = useTranslation();
  const router = useRouter();

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
        <div>
          <nav className={styles.nav}>
            <Link href="/articles-page" className={`${styles.navLink} ${router.pathname === "/articles-page" ? styles.active : ""}`}>
              {t("menu.articles")}
            </Link>
            <Link
              href="/events-page"
              className={`${styles.navLink} ${router.pathname === "/events-page" ? styles.active : ""}`}
            >
              {t("menu.announcements")}
            </Link>
            <Link href="/ads-page" className={`${styles.navLink} ${router.pathname === "/ads-page" ? styles.active : ""}`}>
              {t("menu.ads")}
            </Link>
          </nav>
        </div>
      </div>
      <div className={styles.decorativeLine}>
        <span className={styles.left}>❧</span>
        <span className={styles.right}>❧</span>
      </div>
    </header>
  );
}
