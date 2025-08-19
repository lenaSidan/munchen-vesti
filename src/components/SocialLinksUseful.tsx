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
              ? "Mehr Informationen und Updates:"
              : "Больше информации и обновлений:"}
          </span>
          <span className={styles.shortText}>
            {locale === "de" ? "Weitere Inhalte zum Thema:" : "Ещё материалы по теме:"}
          </span>
        </span>

        <ul className={styles.socialLinksList}>
          <li>
            <a href="https://t.me/lenalexs_life" target="_blank" rel="noopener noreferrer">
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
        </ul>
      </div>
    </div>
  );
}
