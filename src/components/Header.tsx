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
        <Link href="/" className={styles.logo}>
          {t("home.title")}
        </Link>
        <nav className={styles.nav}>
          
          <Link href="/news" className={`${styles.navLink} ${router.pathname === "/news" ? styles.active : ""}`}>
            {t("menu.articles")}
          </Link>
          <Link href="/announcements" className={`${styles.navLink} ${router.pathname === "/announcements" ? styles.active : ""}`}>
            {t("menu.announcements")}
          </Link>
          <Link href="/ads" className={`${styles.navLink} ${router.pathname === "/ads" ? styles.active : ""}`}>
            {t("menu.ads")}
          </Link>
        
        </nav>

        <div className={styles.tools}>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
      <div className={styles.decorativeLine}>
        <span className={styles.left}>❧</span>
        <span className={styles.right}>❧</span>
      </div>
    </header>
  );
}
