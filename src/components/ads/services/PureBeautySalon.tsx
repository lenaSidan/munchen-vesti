import React from "react";
import Image from "next/image";
import styles from "@/components/ads/services/pureBeautySalon.module.css";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import AdWrapper from "../AdWrapper";

export default function PureBeautySalon() {
  const t = useTranslation();

  return (
    <AdWrapper
      title={t("purebeauty.titleSEO")}
      description={t("purebeauty.descriptionSEO")}
      image="/images/pure_beauty_salon.jpg"
      url="/ads/services/pure-beauty-salon"
      type="Service"
      additionalJsonLd={{
        name: t("purebeauty.title"),
        address: {
          "@type": "PostalAddress",
          streetAddress: t("purebeauty.address"),
          addressLocality: "München",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          telephone: "+4930933552259",
          url: "https://wa.me/380933552259",
        },
      }}
    >
      <h1 className={styles.visuallyHidden}>{t("purebeauty.titleSEO")}</h1>

      <div className={styles.mainWrapper}>
        <div className={styles.decorativeLine}></div>

        <div className={styles.titleBox}>
          <div className={styles.title}>{t("purebeauty.title")}</div>
          <div className={styles.subtitle1}>{t("purebeauty.address")}</div>
          <div>
            <Link className={styles.linkBoxHref2} href="https://wa.me/380933552259" target="_blank">
              {t("purebeauty.contact_text")}
            </Link>
          </div>
        </div>

        <div className={styles.adsBox}>
          <div className={styles.adsImageWrapper}>
            <Image
              src="/images/pure_beauty_salon.jpg"
              alt={t("purebeauty.title")}
              className={styles.adsImage}
              width={400}
              height={200}
            />
          </div>
          <div className={styles.rightBox}>
            <div className={styles.subtitleBox}>
              <p>{t("purebeauty.intro")}</p>
            </div>

            <ul className={styles.list}>
              <li>{t("purebeauty.service1")}</li>
              <li>{t("purebeauty.service2")}</li>
              <li>{t("purebeauty.service3")}</li>
              <li>{t("purebeauty.service4")}</li>
              <li>{t("purebeauty.service5")}</li>
              <li>{t("purebeauty.service6")}</li>
              <li>{t("purebeauty.service7")}</li>
              <li>{t("purebeauty.service8")}</li>
              <li>{t("purebeauty.service9")}</li>
            </ul>

            <div className={styles.subtitleBox}>
              <p>{t("purebeauty.consultation")}</p>
            </div>

            <div className={styles.textBlock}>
              <p>{t("purebeauty.priority")}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.decorativeLine} ${styles.bottom}`}></div>
      </div>
    </AdWrapper>
  );
}
