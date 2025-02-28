import Link from "next/link";
import styles from "@/styles/Header.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import useTranslation from "@/hooks/useTranslation";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Header() {
  const t = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {t("home.title")}
        </Link>
        <nav className={styles.nav}>
          <Link href="/articles">{t("menu.articles")}</Link>
          <Link href="/announcements">{t("menu.announcements")}</Link>
          <Link href="/ads">{t("menu.ads")}</Link>
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
