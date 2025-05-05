import styles from "@/styles/OldWordsPage.module.css";
import fs from "fs/promises";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import path from "path";

interface WordData {
  word: string;
  translation: string;
  gender: string;
  type: string;
  explanation_ru?: string;
  origin_ru?: string;
  explanation_de?: string;
  origin_de?: string;
  quote?: string;
}
interface Props {
  words: WordData[];
}

export default function OldWordsPage({ words }: Props) {
  const { locale } = useRouter();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>
        {locale === "de" ? "Vergessene Wörter" : "Забытые немецкие слова"}
      </h1>
      <div className={styles.grid}>
        {words.map((word, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.wordRow}>
              <span className={styles.word}>{word.word}</span>
              <span className={styles.gender}>
                ({word.type}, {word.gender})
              </span>
            </div>
            <p className={styles.translation}>{word.translation}</p>

            <p className={styles.explanation}>
              {locale === "de" ? word.explanation_de : word.explanation_ru}
            </p>
            <p className={styles.origin}>{locale === "de" ? word.origin_de : word.origin_ru}</p>
            <blockquote className={styles.quote}>{word.quote}</blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dir = path.join(process.cwd(), "public", "oldwords", locale === "de" ? "de" : "ru");
  const files = await fs.readdir(dir);

  const words = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(dir, file), "utf-8");
      const { data } = matter(content);
      return data as WordData;
    })
  );

  return {
    props: {
      words: words.sort((a, b) => a.word.localeCompare(b.word)),
    },
  };
};
