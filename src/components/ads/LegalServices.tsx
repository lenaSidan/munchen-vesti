import Image from "next/image";
import styles from "@/components/ads/LegalServices.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function LegalServices() {
  const t = useTranslation();

  return (
    <div className={styles.legalServicesWrapper}>
      {/* Декоративная линия сверху */}
      <div className={styles.decorativeLine}>
        <span className={styles.left}>⊱❧</span>
        <span className={styles.right}>⊱❧</span>
      </div>

      {/* Основное объявление */}
      <div className={styles.legalServices}>
        {/* 📜 Изображение */}
        <div className={styles.announcementImageWrapper}>
          <Image
            src="/images/advocate.webp"
            alt={t("legal_services_title")}
            className={styles.announcementImage}
            width={400}
            height={200}
            layout="responsive"
          />
        </div>

        {/* Заголовок объявления */}
        <h3>⚖️ {t("legal_services_title")}</h3>

        {/* Основной текст */}
        <p>{t("legal_services_text")}</p>

        {/* Список услуг */}
        <ul className={styles.announcementList}>
          <li>- {t("legal_services_point1")}</li>
          <li>- {t("legal_services_point2")}</li>
          <li>- {t("legal_services_point3")}</li>
          <li>- {t("legal_services_point4")}</li>
          <li>- {t("legal_services_point5")}</li>
        </ul>

        {/* Контактная информация */}
        <p>
          <span className={styles.label}>{t("legal_services_location").split(":")[0]}:</span>
          <span className={styles.value}>{t("legal_services_location").split(":")[1]}</span>
        </p>
        <p>
          <span className={styles.label}>{t("legal_services_contact").split(":")[0]}:</span>
          <span className={styles.value}>{t("legal_services_contact").split(":")[1]}</span>
        </p>
        <p>
          <span className={styles.label}>{t("legal_services_more_info").split(":")[0]}:</span>
          <span className={styles.value}>{t("legal_services_more_info").split(":")[1]}</span>
        </p>
      </div>

      {/* Декоративная линия снизу (зеркально) */}
      <div className={`${styles.decorativeLine} ${styles.bottom}`}>
        <span className={styles.right}>⊱❧</span>
        <span className={styles.left}>⊱❧</span>
      </div>
    </div>
  );
}
