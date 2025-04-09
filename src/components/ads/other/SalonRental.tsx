import React from "react";
import styles from "@/components/ads/other/salonRental.module.css";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function SalonRental() {
  const t = useTranslation();

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.adsBox}>
          <div className={styles.adsContent}>
            {/* Видимый заголовок */}
            <div className={styles.titleBox}>
              <h2 className={styles.title}>{t("salon_rental.title")}</h2>
            </div>

            {/* Описание */}
            <div className={styles.description}>
              <p className={styles.description1}>{t("salon_rental.description1")}</p>
              <p className={styles.description2}>{t("salon_rental.description2")}</p>
              <p className={styles.description3}>{t("salon_rental.description3")}</p>
            </div>

            {/* Контакт */}
            <div className={styles.contactBox}>
              <div className={styles.contact}>
                <p>{t("salon_rental.contact")} </p>
                <Link className={styles.address} href="tel:017622972939">
                  0176 2297 2939
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
