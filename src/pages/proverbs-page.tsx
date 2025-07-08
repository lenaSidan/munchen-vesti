import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/ProverbsPage.module.css";
import fs from "fs/promises";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import path from "path";

interface WordData {
  word: string;
  type_de: string;
  type_ru: string;
  translation_de?: string;
  translation_ru: string;
  analog?: string;
}

interface Props {
  words: WordData[];
}

export default function ProverbsPage({ words }: Props) {
  const { locale } = useRouter();
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.proverbs_title")} description={t("meta.proverbs_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.proverbsAll_title")}</h1>
      <div className={styles.mainBox}>
        <div className={styles.introBox}>
          <h2 className={styles.heading}>
            {locale === "de" ? "Sprichwörter and Sprüche" : "Пословицы и поговорки"}
          </h2>
          <div className={styles.intro}>
            <p className={styles.subtitle}>{t("proverbs.subtitle")}</p>
            <p className={styles.descriptionText}>{t("proverbs.description")}</p>
            <p className={styles.descriptionText2}>{t("proverbs.description2")}</p>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.grid}>
            {words.map((word, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.wordRow}>
                  <span className={styles.word}>{word.word}</span>
                </div>

                <p className={styles.gender}>{locale === "de" ? word.type_de : word.type_ru}</p>

                <div className={styles.cardContent}>
                  {word.translation_de && (
                    <p>
                      <span className={styles.translationLabel}>
                        {locale === "de"
                          ? "Hochdeutsche Entsprechung"
                          : "Эквивалент на литературном немецком"}
                        :
                      </span>{" "}
                      <span className={styles.translationDE}>{word.translation_de}</span>
                    </p>
                  )}
                  {word.translation_ru && (
                    <p className={styles.translation}>{word.translation_ru}</p>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  {word.analog && (
                    <p>
                      <span className={styles.analogRU}>
                        {locale === "de" ? "Äquivalent" : "аналог"}:
                      </span>{" "}
                      <span className={styles.analog}>{word.analog}</span>
                    </p>
                  )}
                </div>
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
  const filePath = path.join(process.cwd(), "src", "data", "proverbs.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const words: WordData[] = JSON.parse(fileContent);

  return {
    props: {
      words: words.sort((a, b) => a.word.localeCompare(b.word)),
    },
  };
};
