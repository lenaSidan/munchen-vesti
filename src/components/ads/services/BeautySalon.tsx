import React from "react";
import Image from "next/image";
import styles from "@/components/ads/services/beautySalon.module.css";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function BeautySalon() {
  const t = useTranslation();

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.decorativeLine}></div>

        <div className={styles.titleBox}>
          <div className={styles.title}>
            <Link className={styles.linkBoxHref} href={t("beauticum.link")} target="_blank" rel="noopener noreferrer">
              {t("beauticum.title")}
            </Link>
          </div>
          <div className={styles.subtitle1}>{t("beauticum.address")}</div>
        </div>
        <div className={styles.adsBox}>
          <div className={styles.adsImageWrapper}>
            <Image
              src="/images/kosmetikstudio.webp"
              alt={t("beauticum.title")}
              className={styles.adsImage}
              width={400}
              height={200}
            />
          </div>
          <div className={styles.subtitleBox}>
            <p>{t("beauticum.offers")}</p>
          </div>

          <ul className={styles.list}>
            <li>{t("beauticum.service1")}</li>
            <li>{t("beauticum.service2")}</li>
            <li>{t("beauticum.service3")}</li>
            <li>{t("beauticum.service4")}</li>
            <li>{t("beauticum.service5")}</li>
            <li>{t("beauticum.service6")}</li>
            <li>{t("beauticum.service7")}</li>
            <li>{t("beauticum.service8")}</li>
            <li>{t("beauticum.service9")}</li>
            <li>{t("beauticum.service10")}</li>
            <li>{t("beauticum.service11")}</li>
            <li>{t("beauticum.service12")}</li>
            <li>{t("beauticum.service13")}</li>
            <li>{t("beauticum.service14")}</li>
            <li>{t("beauticum.service15")}</li>
            <li>{t("beauticum.service16")}</li>
          </ul>

          <div className={styles.subtitleBox}>
            <p>{t("beauticum.why_choose_us")}</p>
          </div>

          <div className={styles.textBlock}>
            <p>{t("beauticum.reason1")}</p>
            <p>{t("beauticum.reason2")}</p>
          </div>

          <div className={styles.linkBox}>
            {t("beauticum.contact_text")}{" "}
            <Link className={styles.linkBoxHref2} href="tel:017622972939">
              0176 22972939
            </Link>
          </div>
        </div>

        <div className={`${styles.decorativeLine} ${styles.bottom}`}></div>
      </div>
    </>
  );
}
