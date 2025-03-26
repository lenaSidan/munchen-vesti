import React from "react";
import Image from "next/image";
import styles from "@/components/ads/hairSalon.module.css";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function HairSalonAd() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.decorativeLine}>
        <span className={styles.left}>𐎐</span>
        <span className={styles.right}>𐎐</span>
      </div>
      <div className={styles.adsBox}>
        <div className={styles.adsContent}>
          {/* Заголовок */}
          <div className={styles.titleBox}>
            <h2 className={styles.title}>{t("hair_salon.title")}</h2>
          </div>

          {/* Основной текст */}
          <div className={styles.description}>
            <p className={styles.description1}>{t("hair_salon.description1")}</p>
            <p className={styles.description2}>{t("hair_salon.description2")}</p>
          </div>
          <div className={styles.adsImageWrapper}>
            <Image
              src="/images/hairSalon.webp"
              alt={t("hair_salon.title")}
              className={styles.adsImage}
              width={400}
              height={200}
            />
          </div>
          {/* Контактная информация */}
          <div className={styles.contactBox}>
            <div className={styles.address}>
              <p className={styles.description3}>
                <span className={styles.highlight}>{t("hair_salon.description3_highlight")}</span>
                {t("hair_salon.description3")}
              </p>
              <p className={styles.description3}>{t("hair_salon.description4")}</p>
            </div>
            <div className={styles.contactBox}>
              <p className={styles.contact}>{t("hair_salon.contact")}</p>
            </div>
            <div className={styles.linkBox}>
              {t("hair_salon.web_text")}{" "}
              <Link
                className={styles.linkBoxHref}
                href={t("hair_salon.web_link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                hairteammuenchen.de
              </Link>
              <Link
                className={styles.linkBoxHref}
                href={t("hair_salon.link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("hair_salon.contactInst")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.decorativeLine} ${styles.bottom}`}>
        <span className={styles.right}>𐎐</span>
        <span className={styles.left}>𐎐</span>
      </div>
    </div>
  );
}
