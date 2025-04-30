import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import styles from "@/styles/ErrorPage.module.css";

export default function ServerErrorPage() {
  const t = useTranslation();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>500</h1>
      <p className={styles.message}>{t("error.500_message")}</p>
      <Link href="/" className={styles.link}>
        {t("error.back_home")}
      </Link>
    </div>
  );
}
