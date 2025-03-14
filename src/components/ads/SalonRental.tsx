import React from "react";
import styles from "@/components/ads/salonRental.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function SalonRental() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.adsBox}>
        <div className={styles.adsContent}>
          {/* Заголовок */}
          <div className={styles.titleBox}>
            <h2 className={styles.title}>{t("salon_rental.title")}</h2>
          </div>

          {/* Основной текст */}
          <div className={styles.description}>
            <p className={styles.description1}>{t("salon_rental.description1")}</p>
            <p className={styles.description2}>{t("salon_rental.description2")}</p>
            <p className={styles.description3}>{t("salon_rental.description3")}</p>
          </div>

          {/* Контактная информация */}
          <div className={styles.contactBox}>
            <p className={styles.contact}>{t("salon_rental.contact")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
