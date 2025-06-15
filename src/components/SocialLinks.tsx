import styles from "@/styles/SocialLinks.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SocialLinks() {
  const { locale } = useRouter();
  return (
  <div className={styles.socialLinksBlock}>
  <div className={styles.row}>
    <span className={styles.text}>
      <span className={styles.fullText}>
        {locale === "de"
          ? "Verfolgen Sie die Nachrichten und teilen Sie sie mit Freunden:"
          : "Следите за новостями и делитесь с друзьями:"}
      </span>
      <span className={styles.shortText}>
        {locale === "de" ? "Folgen Sie uns:" : "Следите за нами:"}
      </span>
    </span>

    <ul className={styles.socialLinksList}>
      <li>
        <a href="https://t.me/munchen_vesti" target="_blank" rel="noopener noreferrer">
          <Image
            src="/icons/telegram_icon_dark.png"
            alt="Telegram"
            width={20}
            height={17}
            className={styles.icon}
          />
          Telegram
        </a>
      </li>
      <li>
        <a
          href="https://www.instagram.com/munchen_vesti?igsh=N294YnI5aTZ6angz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/instagram_icon_dark.png"
            alt="Instagram"
            width={20}
            height={17}
            className={styles.icon}
          />
          Instagram
        </a>
      </li>
      <li>
        <a
          href="https://www.facebook.com/munchen.vesti/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/facebook_icon_dark.png"
            alt="Facebook"
            width={20}
            height={17}
            className={styles.icon}
          />
          Facebook
        </a>
      </li>
    </ul>
  </div>
</div>

  );
}
