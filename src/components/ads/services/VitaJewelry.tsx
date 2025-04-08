import React from "react";
import styles from "@/components/ads/services/vitaJewelry.module.css";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";
import AdWrapper from "@/components/ads/AdWrapper";

export default function ViletaJewelry() {
  const t = useTranslation();

  const title = t("vileta.titleSEO");
  const description = t("vileta.descriptionSEO");

  return (
    <AdWrapper
      title={title}
      description={description}
      image="/images/vileta_jewelry.webp"
      url="/ads/vileta"
      additionalJsonLd={{
        address: {
          "@type": "PostalAddress",
          addressLocality: "München",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          url: t("vileta.link"),
        },
      }}
    >
       <h1 className={styles.visuallyHidden}>{title}</h1>
      <div className={styles.mainWrapper}>
        <div className={styles.decorativeLine}></div>

        <div className={styles.adsBox}>
          <div className={styles.adsContent}>
            <div className={styles.titleBox}>
              <h2 className={styles.title}>{t("vileta.title")}</h2>
            </div>

            <div className={styles.description}>
              <p className={styles.description1}>{t("vileta.description1")}</p>
              <p className={styles.description2}>{t("vileta.description2")}</p>
              <p className={styles.description3}>{t("vileta.description3")}</p>
            </div>

            <div className={styles.adsImageWrapper}>
              <Image
                src="/images/vileta_jewelry.webp"
                alt={t("vileta.title")}
                className={styles.adsImage}
                width={400}
                height={200}
              />
            </div>

            <div className={styles.linkBox}>
              <Link
                className={styles.linkBoxHref}
                href={t("vileta.link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("vileta.contact")}
              </Link>
            </div>
          </div>
        </div>

        <div className={`${styles.decorativeLine} ${styles.bottom}`}></div>
      </div>
    </AdWrapper>
  );
}
