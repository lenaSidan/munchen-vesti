import styles from "@/components/ads/education/englishLessons.module.css";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function EnglishLessons() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.adsBox}>
        <div className={styles.adsContent}>
          {/* Title */}
          <div className={styles.titleBox}>
            <h2 className={styles.title}>{t("english_lessons.title")}</h2>
          </div>

          {/* Description */}
          <div className={styles.description}>
            <p className={styles.description1}>{t("english_lessons.description1")}</p>
            <div className={styles.listBox}>
              <ul className={styles.list}>
                <li>{t("english_lessons.detail1")}</li>
                <li>{t("english_lessons.detail2")}</li>
                <li>{t("english_lessons.detail3")}</li>
                <li>{t("english_lessons.detail4")}</li>
                <li>{t("english_lessons.detail5")}</li>
              </ul>
            </div>
            <p className={styles.description3}>{t("english_lessons.description3")}</p>
          </div>

          {/* Contact */}
          <div className={styles.contactBox}>
            <div className={styles.contact}>
              <p className={styles.contactTitle}>{t("english_lessons.contact_label")}</p>
              <p className={styles.address}>{t("english_lessons.contact_name")}</p>
              <Link className={styles.address} href="tel:+994773006510">
                {t("english_lessons.contact_phone")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
