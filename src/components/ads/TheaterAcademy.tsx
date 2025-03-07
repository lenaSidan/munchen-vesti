import Image from "next/image";
import styles from "@/components/ads/theaterAcademy.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function TheaterAcademy() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.decorativeLine}>
        <span className={styles.left}>⊱❧</span>
        <span className={styles.right}>⊱❧</span>
      </div>
      <h3>{t("theater_academy_title")}</h3>
      <div className={styles.subtitleBox}>
        <p>{t("theater_academy_description")}</p>
      </div>
      <div className={styles.adsBox}>
        <div className={styles.textBox}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/theaterAcademy.webp"
              alt={t("theater_academy_title")}
              className={styles.image}
              width={400}
              height={200}
            
            />
          </div>
          <div>
            <div className={styles.contactBox}>
              <p>
                <span className={styles.label}>{t("theater_academy_location").split(":")[0]}:</span>
                <span className={styles.value}>{t("theater_academy_location").split(":")[1]}</span>
              </p>
              <p>
                <span className={styles.label}>{t("theater_academy_contact").split(":")[0]}:</span>
                <span className={styles.value}>{t("theater_academy_contact").split(":")[1]}</span>
              </p>
              <p>
                <span className={styles.label}>{t("theater_academy_more_info_label")}: </span>
                <a
                  href={t("theater_academy_more_info")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.valueLink}
                >
                  {t("theater_academy_more_info")}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.textContainer}>
          <ul className={styles.list}>
            {[
              { bold: t("theater_academy_point1_bold"), post: t("theater_academy_point1_post") },
              { bold: t("theater_academy_point2_bold"), post: t("theater_academy_point2_post") },
              { bold: t("theater_academy_point3_bold"), post: t("theater_academy_point3_post") },
              { bold: t("theater_academy_point4_bold"), post: t("theater_academy_point4_post") },
              { bold: t("theater_academy_point5_bold"), post: t("theater_academy_point5_post") },
              { bold: t("theater_academy_point6_bold"), post: t("theater_academy_point6_post") },
              {
                pre: t("theater_academy_point7_pre"),
                bold: t("theater_academy_point7_bold"),
                post: t("theater_academy_point7_post"),
              },
              { bold: t("theater_academy_point8_bold"), post: t("theater_academy_point8_post") },
              { pre: t("theater_academy_point9_pre"), bold: t("theater_academy_point9_bold") },
              {
                bold: t("theater_academy_point10_bold"),
                post: t("theater_academy_point10_post"),
              },
              {
                pre: t("theater_academy_point11_pre"),
                bold: t("theater_academy_point11_bold"),
                post: t("theater_academy_point11_post"),
              },
              {
                bold: t("theater_academy_point12_bold"),
                post: t("theater_academy_point12_post"),
              },
              {
                pre: t("theater_academy_point13_pre"),
                bold: t("theater_academy_point13_bold"),
                post: t("theater_academy_point13_post"),
              },
              {
                bold: t("theater_academy_point14_bold"),
                post: t("theater_academy_point14_post"),
              },
              {
                pre: t("theater_academy_point15_pre"),
                bold: t("theater_academy_point15_bold"),
                post: t("theater_academy_point15_post"),
              },
              { pre: t("theater_academy_point16_pre"), bold: t("theater_academy_point16_bold") },
              { pre: t("theater_academy_point17_pre"), bold: t("theater_academy_point17_bold") },
            ].map((item, index) => (
              <li key={index}>
                {item.pre}
                <strong> {item.bold} </strong>
                {item.post}
              </li>
            ))}
          </ul>
          {/* <ul className={styles.list}>
              {[
                "theater_academy_point1",
                "theater_academy_point2",
                "theater_academy_point3",
                "theater_academy_point4",
                "theater_academy_point5",
                "theater_academy_point6",
                "theater_academy_point7",
                "theater_academy_point8",
              ].map((key, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: t(key) }} />
              ))}
            </ul> */}
        </div>
      </div>

      <div className={`${styles.decorativeLine} ${styles.bottom}`}>
        <span className={styles.right}>⊱❧</span>
        <span className={styles.left}>⊱❧</span>
      </div>
    </div>
  );
}
