import styles from "@/styles/OldWordOfTheWeek.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface WordData {
  word: string;
  translation: string;
  gender: string;
  type: string;
  explanation_ru?: string;
  origin_ru?: string;
  explanation_de?: string;
  origin_de?: string;
  quote: string;
}

export default function OldWordOfTheWeek({ words }: { words: WordData[] }) {
  const { locale } = useRouter();

  if (!words || !words.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.announcementHeader}>
        <h2 className={styles.heading}>
          {locale === "de" ? "Vergessene Wörter" : "​Забытые​ ​немецкіе​ слова"}
        </h2>
        <Image
          src="/icons/info.png"
          alt="Info"
          width={20}
          height={20}
          className={`${styles.announcementIcon} ${styles.info}`}
        />
      </div>

      <div className={styles.decorativeLine}></div>
      {words.map((wordData, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.wordRow}>
            <span className={styles.word}>{wordData.word}</span>
            <span className={styles.gender}>({wordData.type}, {wordData.gender})</span>
          </div>
          <p className={styles.translation}>{wordData.translation}</p>

          <p className={styles.explanation}>
            {locale === "de" ? wordData.explanation_de : wordData.explanation_ru}
          </p>
          <p className={styles.origin}>
            {locale === "de" ? wordData.origin_de : wordData.origin_ru}
          </p>
          <blockquote className={styles.quote}>{wordData.quote}</blockquote>
        </div>
      ))}
      <div className={styles.footerLink}>
        <Link href="/oldwords-page" className={styles.allWordsLink}>
          {locale === "de" ? "Alle Wörter ansehen →" : "Все слова →"}
        </Link>
      </div>
    </div>
  );
}
