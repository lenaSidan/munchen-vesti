import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/About.module.css";

export default function About() {
  const t = useTranslation();

  return (
    <div className={styles.container}>
      <h2>{t("about.title")}</h2>
      <p>{t("about.description")}</p>
    </div>
  );
}
