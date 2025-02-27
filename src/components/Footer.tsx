import Link from "next/link";
import styles from "@/styles/Footer.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function Footer() {
  const t = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.brand}>
          <Link href="/">{t("home.title")}</Link>
        </p>
        <nav className={styles.nav}>
          <Link href="/about">{t("footer.about")}</Link>
          <Link href="/contacts">{t("footer.contacts")}</Link>
        </nav>
        <p className={styles.copyright}>
          {t("footer.copyright").replace("{year}", currentYear.toString())}
        </p>
      </div>
    </footer>
  );
}
