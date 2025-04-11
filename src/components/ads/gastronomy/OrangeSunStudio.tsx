import React from "react";
import styles from "@/components/ads/gastronomy/orangeSunStudio.module.css";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

export default function OrangeSunStudio() {
  const t = useTranslation();

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.decorativeLine}></div>

        <div className={styles.adsBox}>
          <div className={styles.adsContent}>
            <h2 className={styles.title}>{t("orange_sun.title")}</h2>
            <p className={styles.intro}>{t("orange_sun.intro")}</p>

            <h3 className={styles.subtitle}>{t("orange_sun.dessert_title")}</h3>
            <p className={styles.sub}>{t("orange_sun.dessert_description")}</p>

            <h3 className={styles.subtitle}>{t("orange_sun.second_dessert_title")}</h3>
            <div className={styles.image_textBox}>
              <div className={styles.adsImageWrapper}>
                <Image
                  src="/images/orangesun_pastry.webp"
                  alt={t("orange_sun.second_dessert_title")}
                  className={styles.adsImage}
                  width={300}
                  height={300}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className={styles.torteBox}>
                <p className={styles.descriptionTorte}>{t("orange_sun.second_dessert_description")}</p>
                <ul className={styles.dessertList}>
                  <li>{t("orange_sun.detail1")}</li>
                  <li>{t("orange_sun.detail2")}</li>
                  <li>{t("orange_sun.detail3")}</li>
                  <li>{t("orange_sun.detail4")}</li>
                  <li>{t("orange_sun.detail5")}</li>
                </ul>
              </div>
            </div>

            <h4 className={styles.subtitle}>{t("orange_sun.music_title")}</h4>
            <ul className={styles.musicList}>
              <li>{t("orange_sun.track4")}</li>
              <li>{t("orange_sun.track5")}</li>
              <li>{t("orange_sun.track6")}</li>
              <li>{t("orange_sun.track7")}</li>
              <li>{t("orange_sun.track8")}</li>
              <li>{t("orange_sun.track9")}</li>
              <li>{t("orange_sun.track10")}</li>
              <li>{t("orange_sun.track11")}</li>
            </ul>

            <p className={styles.invite}>{t("orange_sun.invite")}</p>
            <div className={styles.linkBox}>
              {t("orange_sun.web_text")}{" "}
              <Link
                className={styles.linkBoxHref}
                href={t("orange_sun.web_link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Natali Orangesun
              </Link>
              <Link
                className={styles.linkBoxHref}
                href={t("orange_sun.link")}
                target="_blank"
                rel="noopener noreferrer"
                legacyBehavior>
                {t("orange_sun.contactInst")}
              </Link>
            </div>
          </div>
        </div>

        <div className={`${styles.decorativeLine} ${styles.bottom}`}></div>
      </div>
    </>
  );
}
