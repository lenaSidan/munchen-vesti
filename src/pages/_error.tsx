import { NextPageContext } from "next";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import styles from "@/styles/ErrorPage.module.css";

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  const t = useTranslation();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>{statusCode || 500}</h1>
      <p className={styles.message}>
        {statusCode === 404
          ? t("error.404_message")
          : t("error.500_message")}
      </p>
      <Link href="/" className={styles.link}>
        {t("error.back_home")}
      </Link>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return { statusCode };
};

export default Error;
