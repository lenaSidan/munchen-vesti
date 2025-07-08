import styles from "@/styles/OldWordOfTheWeek.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

interface WordData {
  word: string;
  type_de: string;
  type_ru: string;
  gender_de: string;
  gender_ru: string;
  translation_de: string;
  translation_ru: string;
  explanation_de?: string;
  explanation_ru?: string;
  origin_de?: string;
  origin_ru?: string;
  quote_de?: string;
  quote_ru?: string;
}

export default function BavarianWordOfTheWeek({ words }: { words: WordData[] }) {
  const { locale } = useRouter();

  if (!words || !words.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.announcementHeader}>
        <h2 className={styles.heading}>
          {locale === "de" ? "Bairische Wörter" : "​Баварские слова"}
        </h2>
      </div>

      <div className={styles.decorativeLine}></div>
      {words.map((wordData, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.wordRow}>
            <span className={styles.word}>{wordData.word}</span>
            <span className={styles.gender}>
              ({locale === "de" ? wordData.type_de : wordData.type_ru}
              {wordData.gender_de || wordData.gender_ru
                ? `, ${locale === "de" ? wordData.gender_de : wordData.gender_ru}`
                : ""}
              )
            </span>
          </div>
          <p className={styles.translation}>
            {locale === "de" ? wordData.translation_de : wordData.translation_ru}
          </p>

          <p className={styles.explanation}>
            {locale === "de" ? wordData.explanation_de : wordData.explanation_ru}
          </p>
          <p className={styles.origin}>
            {locale === "de" ? wordData.origin_de : wordData.origin_ru}
          </p>
          {(wordData.quote_de || wordData.quote_ru) && (
            <blockquote className={styles.quote}>
              {locale === "de" ? (
                wordData.quote_de
              ) : (
                <>
                  <div>{wordData.quote_de}</div>
                  <div className={styles.quoteTranslation}>{wordData.quote_ru}</div>
                </>
              )}
            </blockquote>
          )}
        </div>
      ))}
      <div className={styles.footerLink}>
        <Link href="/bavarian-words" className={styles.allWordsLink}>
          {locale === "de" ? "Alle Wörter ansehen →" : "Все слова →"}
        </Link>
      </div>
    </div>
  );
}
