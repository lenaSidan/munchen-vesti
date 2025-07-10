import Seo from "@/components/Seo";
import SocialLinks from "@/components/SocialLinks";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
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
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.oldWords_title")} description={t("meta.oldWords_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.oldWordsAll_title")}</h1>
      <div className={styles.mainBox}>
        <div className={styles.introBox}>
          <h2 className={styles.heading}>
            {locale === "de" ? "Vergessene Wörter" : "Забытые немецкие слова"}
          </h2>
          <div className={styles.intro}>
            <p className={styles.subtitle}>{t("oldword.subtitle")}</p>
            <p className={styles.descriptionText}>{t("oldword.description")}</p>
            <p className={styles.descriptionText2}>{t("oldword.description2")}</p>
          </div>
          <div className={styles.socialLinks}>
            <SocialLinks />
          </div>
        </div>

        <div className={styles.wrapper}>
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
        <SubscribeBox />
      </div>
    </>
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
