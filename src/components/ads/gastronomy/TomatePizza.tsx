import React from "react";
import styles from "@/components/ads/gastronomy/tomatePizza.module.css";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import AdWrapper from "../AdWrapper";

export default function TomatePizzaAd() {
  const t = useTranslation();

  return (
    <AdWrapper
      title={t("tomate_pizza.titleSEO")}
      description={t("tomate_pizza.descriptionSEO)")}
      image="/images/tomate_pizza.webp"
      url="/ads/gastronomy/tomate-pizza"
      additionalJsonLd={{
        address: {
          "@type": "PostalAddress",
          streetAddress: t("tomate_pizza.address"),
          addressLocality: "München",
        },
      }}
    >
      <h1 className={styles.visuallyHidden}>{t("tomate_pizza.titleSEO")}</h1>
      <div className={styles.mainWrapper}>
        <div className={styles.adsBox}>
          <div className={styles.adsContent}>
            <div className={styles.image_textBox}>
              <div className={styles.adsImageWrapper}>
                <Image
                  src="/images/tomate.webp"
                  alt="Tomate Pizza"
                  width={500}
                  height={200}
                  className={styles.adImage}
                />
              </div>
              <div className={styles.textContainer}>
                <h2 className={styles.title}>{t("tomate_pizza.title")}</h2>
                <p className={styles.description}>{t("tomate_pizza.description")}</p>
              </div>
            </div>
            <div className={styles.contact}>
              <div className={styles.linkBox}>{t("tomate_pizza.address")}</div>

              <Link className={styles.address} href="tel:08962423100">
                089 624 23 100
              </Link>

              <div className={styles.contactBox}>
                <div className={styles.linkBox}>
                  {t("tomate_pizza.web_text")}
                  <Link
                    className={styles.linkBoxHref}
                    href={t("tomate_pizza.web_link")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.menu.tomate-pizza.de
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdWrapper>
  );
}
