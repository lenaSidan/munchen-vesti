import styles from "@/styles/SocialLinksUseful.module.css";
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
          ? "Beratung vereinbaren – konkrete Schritte:"
          : "Запишитесь на консультацию — получите конкретные шаги:"}
      </span>
      <span className={styles.shortText}>
        {locale === "de" ? "Beratung vereinbaren:" : "Запишитесь на консультацию:"}
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
          href="https://www.instagram.com/lena.lexs?igsh=Z29tOTA3N3N0b3lw"
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
