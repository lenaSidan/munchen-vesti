import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Footer.module.css";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

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

        <div className={styles.socials}>
          <a href="https://t.me/твоя_ссылка" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <Image
              src="/icons/telegram_icon.png"
              alt="Telegram"
              width={50}
              height={50}
              className={`${styles.socialIcon} ${styles.telegram}`}
            />
          </a>

          <a
            href="https://www.instagram.com/munchen_vesti?igsh=N294YnI5aTZ6angz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image
              src="/icons/instagram_icon.png"
              alt="Instagram"
              width={50}
              height={50}
              className={`${styles.socialIcon} ${styles.instagram}`}
            />
          </a>
          <a
            href="https://www.facebook.com/munchen.vesti/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="facebook"
          >
            <Image
              src="/icons/facebook_icon.png"
              alt="Facebook"
              width={50}
              height={50}
              className={`${styles.socialIcon} ${styles.facebook}`}
            />
          </a>
        </div>
        <p className={styles.copyright}>{t("footer.copyright").replace("{year}", currentYear.toString())}</p>
      </div>
    </footer>
  );
}
