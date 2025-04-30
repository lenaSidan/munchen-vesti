import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import styles from "@/styles/ErrorPage.module.css";

export default function NotFoundPage() {
  const t = useTranslation();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>{t("error.404_message")}</p>
      <Link href="/" className={styles.link}>
        {t("error.back_home")}
      </Link>
    </div>
  );
}
