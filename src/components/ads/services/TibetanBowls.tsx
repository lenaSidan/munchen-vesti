import React from "react";
import styles from "@/components/ads/services/tibetanBowls.module.css";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

export default function TibetanBowls() {
  const t = useTranslation();

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.decorativeLine}></div>

        <div className={styles.adsBox}>
          <div className={styles.adsContent}>
            <div className={styles.titleBox}>
              <h2 className={styles.title}>{t("tibetan_bowls.title")}</h2>
            </div>

            <div className={styles.adsImageWrapper}>
              <Image
                src="/images/tibetan_bowls.webp"
                alt={t("tibetan_bowls.title")}
                className={styles.adsImage}
                width={400}
                height={200}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            <div className={styles.description}>
              <p>
                <strong>{t("tibetan_bowls.highlight1")}</strong> {t("tibetan_bowls.description1")}
              </p>
              <p>
                <strong>{t("tibetan_bowls.highlight2")}</strong> {t("tibetan_bowls.description2")}
              </p>
              <p>{t("tibetan_bowls.description3")}</p>
            </div>

            <div className={styles.benefits}>
              <h3>{t("tibetan_bowls.benefits_title")}</h3>
              <p>{t("tibetan_bowls.benefit1")}</p>
              <p>{t("tibetan_bowls.benefit2")}</p>
              <p>{t("tibetan_bowls.benefit3")}</p>
            </div>

            <div className={styles.linkBox}>
              {t("tibetan_bowls.contact_text")}{" "}
              <Link
                className={styles.linkBoxHref}
                href={t("tibetan_bowls.contact_link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                @letta_beauty_munchen
              </Link>
            </div>
          </div>
        </div>

        <div className={`${styles.decorativeLine} ${styles.bottom}`}></div>
      </div>
    </>
  );
}
