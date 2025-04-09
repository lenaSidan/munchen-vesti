import React from "react";
import Image from "next/image";
import styles from "@/components/ads/services/psychologistTatjana.module.css";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function PsychologistTatjana() {
  const t = useTranslation();

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.decorativeLine}>
          <span className={styles.left}>⊱❧</span>
          <span className={styles.right}>⊱❧</span>
        </div>

        <div className={styles.adsBox}>
          <div className={styles.adsImageWrapper}>
            <Image
              src="/images/psychologist.webp"
              alt={t("psychologist_title")}
              className={styles.adsImage}
              width={400}
              height={200}
            />
          </div>

          <div className={styles.titleBox}>
            <div className={styles.title}>{t("psychologist_title")}</div>
            <div className={styles.subtitle1}>{t("psychologist_description_point1")}</div>
            <div className={styles.subtitle2}>{t("psychologist_description_point2")}</div>
          </div>

          <div className={styles.subtitleBox}>
            <p>{t("psychologist_subtitle")}</p>
          </div>

          <ul className={styles.list}>
            <li>{t("psychologist_point1")}</li>
            <li>{t("psychologist_point2")}</li>
            <li>{t("psychologist_point3")}</li>
            <li>{t("psychologist_point4")}</li>
            <li>{t("psychologist_point5")}</li>
            <li>{t("psychologist_point6")}</li>
            <li>{t("psychologist_point7")}</li>
            <li>{t("psychologist_point8")}</li>
            <li>{t("psychologist_point9")}</li>
            <li>{t("psychologist_point10")}</li>
          </ul>

          <div className={styles.text1}>
            <p>{t("psychologist_text1")}</p>
          </div>
          <div className={styles.text2}>
            <p>{t("psychologist_text2")}</p>
          </div>
          <div className={styles.text3}>
            <p>{t("psychologist_text3")}</p>
          </div>

          <div className={styles.linkBox}>
            {t("psychologist_contact_text")}{" "}
            <Link
              className={styles.linkBoxHref}
              href={t("psychologist_contact_link")}
              target="_blank"
              rel="noopener noreferrer"
            >
              @smirtatjana
            </Link>
          </div>

          <div className={styles.linkBox}>
            {t("psychologist_web_text")}{" "}
            <Link
              className={styles.linkBoxHref}
              href={t("psychologist_web_link")}
              target="_blank"
              rel="noopener noreferrer"
            >
              tatjanasmirnova.com
            </Link>
          </div>
        </div>

        <div className={`${styles.decorativeLine} ${styles.bottom}`}>
          <span className={styles.right}>⊱❧</span>
          <span className={styles.left}>⊱❧</span>
        </div>
      </div>
    </>
  );
}
