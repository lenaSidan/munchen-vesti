import React from "react";
import Image from "next/image";
import styles from "@/components/Ads/lettaBeauty.module.css";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function LettaBeauty() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      {/* Декоративная линия сверху */}
      <div className={styles.decorativeLine}></div>

      <div className={styles.titleBox}>
        <div className={styles.title}>
          <Link
            className={styles.linkBoxHref}
            href={t("letta.link")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("letta.title")}
          </Link>
        </div>
        <div className={styles.subtitle1}>{t("letta.address")}</div>
      </div>

      <div className={styles.adsBox}>
        <div className={styles.adsImageWrapper}>
          <Image
            src="/images/letta_beauty.webp"
            alt={t("letta.title")}
            className={styles.adsImage}
            width={400}
            height={200}
          />
        </div>

        <div className={styles.subtitleBox}>
          <p>{t("letta.description1")}</p>
        </div>

        <ul className={styles.servicesList}>
          <li>{t("letta.service1")}</li>
          <li>{t("letta.service2")}</li>
          <li>{t("letta.service3")}</li>
          <li>{t("letta.service4")}</li>
        </ul>

        <div className={styles.textBlock}>
          <p>{t("letta.description2")}</p>
        </div>

        {/* Контактная информация */}
        <div className={styles.linkBox}>
          {t("letta.contact_text")}{" "}
          <Link
            className={styles.linkBoxHref2}
            href={t("letta.link")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("letta.contact")}
          </Link>
        </div>
      </div>

      {/* Декоративная линия снизу */}
      <div className={`${styles.decorativeLine} ${styles.bottom}`}></div>
    </div>
  );
}
