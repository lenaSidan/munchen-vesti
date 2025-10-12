import data from "@/data/mobileHighlight.json";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/MobileHighlight.module.css";
import Image from "next/image";
import Link from "next/link";

export default function MobileHighlight() {
  const t = useTranslation();

  return (
    <section className={styles.highlight}>
      <h3 className={styles.title}>{t("mobileHighlight.sectionTitle")}</h3>
      <div className={styles.card}>
        <Image
          src={data.image}
          alt={t("mobileHighlight.title")}
          width={400}
          height={220}
          className={styles.image}
        />
        <div className={styles.content}>
          <h4 className={styles.cardTitle}>{t("mobileHighlight.title")}</h4>
          <p className={styles.text}>{t("mobileHighlight.text")}</p>
          <Link href={`/events-page#${data.fileId}`} className={styles.link}>
            {t("mobileHighlight.read_more")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
