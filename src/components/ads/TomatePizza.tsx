import React from "react";
import styles from "@/components/ads/tomatePizza.module.css";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function TomatePizzaAd() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.adsBox}>
        <div className={styles.adsContent}>
          <div className={styles.adsImageWrapper}>
            <Image src="/images/tomate.webp" alt="Tomate Pizza" width={500} height={200} className={styles.adImage} />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{t("tomate_pizza.title")}</h2>
            <p className={styles.description}>{t("tomate_pizza.description")}</p>
          </div>
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
  );
}
