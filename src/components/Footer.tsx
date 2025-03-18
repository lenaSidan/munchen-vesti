import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Footer.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function Footer() {
  const t = useTranslation();
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.decorativeLine}></div>
      <div className={styles.container}>
        <p className={styles.brand}>
          <Link href="/">{t("home.title")}</Link>
        </p>

        <nav className={styles.nav}>
          <div className={styles.linkBox}>
            <Link href="/about" className={`${styles.navLink} ${router.pathname === "/about" ? styles.active : ""}`}>
              {t("footer.about")}
            </Link>
            <Link
              href="/contacts"
              className={`${styles.navLink} ${router.pathname === "/contacts" ? styles.active : ""}`}
            >
              {t("footer.contacts")}
            </Link>
            <Link
              href="/impressum"
              className={`${styles.navLink} ${router.pathname === "/impressum" ? styles.active : ""}`}
            >
              {t("footer.impressum")}
            </Link>
          </div>
          <div className={styles.policyBox}>
            <Link
              href="/privacy-policy"
              className={`${styles.navLink} ${router.pathname === "/privacy-policy" ? styles.active : ""}`}
            >
              {t("footer.privacy-policy")}
            </Link>
          </div>
        </nav>
        <p className={styles.copyright}>{t("footer.copyright").replace("{year}", currentYear.toString())}</p>
      </div>
    </footer>
  );
}
