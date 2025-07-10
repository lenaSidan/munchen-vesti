import Seo from "@/components/Seo";
import SocialLinks from "@/components/SocialLinks";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/BavarianWordsPage.module.css";
import fs from "fs/promises";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import path from "path";

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

interface Props {
  words: WordData[];
}

export default function BavarianWordsPage({ words }: Props) {
  const { locale } = useRouter();
  const t = useTranslation();

  return (
    <>
      <Seo
        title={t("meta.bavarianWords_title")}
        description={t("meta.bavarianWords_description")}
      />
      <h1 className={styles.visuallyHidden}>{t("meta.bavarianWordsAll_title")}</h1>
      <div className={styles.mainBox}>
        <div className={styles.introBox}>
          <h2 className={styles.heading}>
            {locale === "de" ? "Bairische Wörter" : "Баварские слова"}
          </h2>
          <div className={styles.intro}>
            <p className={styles.subtitle}>{t("bavarianWords.subtitle")}</p>
            <p className={styles.descriptionText}>{t("bavarianWords.description")}</p>
            <p className={styles.descriptionText2}>{t("bavarianWords.description2")}</p>
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
                    ({locale === "de" ? word.type_de : word.type_ru}
                    {word.gender_de || word.gender_ru
                      ? `, ${locale === "de" ? word.gender_de : word.gender_ru}`
                      : ""}
                    )
                  </span>
                </div>
                <p className={styles.translation}>
                  {locale === "de" ? word.translation_de : word.translation_ru}
                </p>
                <p className={styles.explanation}>
                  {locale === "de" ? word.explanation_de : word.explanation_ru}
                </p>
                <p className={styles.origin}>{locale === "de" ? word.origin_de : word.origin_ru}</p>
                {(word.quote_de || word.quote_ru) && (
                  <blockquote className={styles.quote}>
                    {locale === "de" ? (
                      word.quote_de
                    ) : (
                      <>
                        <div>{word.quote_de}</div>
                        <div className={styles.quoteTranslation}>{word.quote_ru}</div>
                      </>
                    )}
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </div>
        <SubscribeBox />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "src", "data", "bavarian-words.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const words: WordData[] = JSON.parse(fileContent);

  return {
    props: {
      words: words.sort((a, b) => a.word.localeCompare(b.word)),
    },
  };
};
