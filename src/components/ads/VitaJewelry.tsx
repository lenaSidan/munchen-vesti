import React from "react";
import styles from "@/components/ads/vitaJewelry.module.css";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

export default function ViletaJewelry() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      {/* Декоративная линия сверху */}
      <div className={styles.decorativeLine}>
        {/* <span className={styles.left}>𐎐</span>
        <span className={styles.right}>𐎐</span> */}
      </div>

      <div className={styles.adsBox}>
        <div className={styles.adsContent}>
          {/* Заголовок */}
          <div className={styles.titleBox}>
            <h2 className={styles.title}>{t("vileta.title")}</h2>
          </div>

          {/* Основной текст */}
          <div className={styles.description}>
            <p className={styles.description1}>{t("vileta.description1")}</p>
            <p className={styles.description2}>{t("vileta.description2")}</p>
            <p className={styles.description3}>{t("vileta.description3")}</p>
          </div>
          {/* Изображение */}
          <div className={styles.adsImageWrapper}>
            <Image
              src="/images/vileta_jewelry.webp"
              alt={t("vileta.title")}
              className={styles.adsImage}
              width={400}
              height={200}
            />
          </div>
          {/* Контактная информация */}
          <div className={styles.linkBox}>
            <Link className={styles.linkBoxHref} href={t("vileta.link")} target="_blank" rel="noopener noreferrer">
              {t("vileta.contact")}
            </Link>
          </div>
        </div>
      </div>

      {/* Декоративная линия снизу */}
      <div className={`${styles.decorativeLine} ${styles.bottom}`}>
        {/* <span className={styles.right}>𐎐</span>
        <span className={styles.left}>𐎐</span> */}
      </div>
    </div>
  );
}
