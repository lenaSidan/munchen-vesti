import Image from "next/image";
import styles from "@/components/ads/theaterAcademyMainPage.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function TheaterAcademy() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
     
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
          <div className={styles.textContainer}>
          <h4>{t("theater_academy_subtitle")}</h4>
            <ul className={styles.list}>
              {[
                {
                  pre: t("theater_academy_point1_pre"),
                  bold: t("theater_academy_point1_bold"),
                  post: t("theater_academy_point1_post"),
                },
                {
                  pre: t("theater_academy_point2_pre"),
                  bold: t("theater_academy_point2_bold"),
                  post: t("theater_academy_point2_post"),
                },
                {
                  pre: t("theater_academy_point3_pre"),
                  bold: t("theater_academy_point3_bold"),
                },
                {
                  pre: t("theater_academy_point4_pre"),
                  bold: t("theater_academy_point4_bold"),
                  post: t("theater_academy_point4_post"),
                },
                {
                  pre: t("theater_academy_point5_pre"),
                  bold: t("theater_academy_point5_bold"),
                  post: t("theater_academy_point5_post"),
                },
              ].map((item, index) => (
                <li key={index}>
                  {item.pre}
                  <strong> {item.bold} </strong>
                  {item.post}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.textContainer}>
            <h4>{t("theater_academy_creative_center")}</h4>
            <ul className={styles.list}>
              {[
                {
                  pre: t("theater_academy_group_teremok_post1"),
                  bold: t("theater_academy_group_teremok_bold"),
                  post: t("theater_academy_group_teremok_post2"),
                },
                {
                  pre: t("theater_academy_group_lyuboznayki_post1"),
                  bold: t("theater_academy_group_lyuboznayki_bold"),
                  post: t("theater_academy_group_lyuboznayki_post2"),
                },
                {
                  pre: t("theater_academy_group_zolotoy_klyuchik_post1"),
                  bold: t("theater_academy_group_zolotoy_klyuchik_bold"),
                  post: t("theater_academy_group_zolotoy_klyuchik_post2"),
                },
                {
                  pre: t("theater_academy_group_zaychata_post1"),
                  bold: t("theater_academy_group_zaychata_bold"),
                  post: t("theater_academy_group_zaychata_post2"),
                },
                {
                  pre: t("theater_academy_group_starty_post1"),
                  bold: t("theater_academy_group_starty_bold"),
                  post: t("theater_academy_group_starty_post2"),
                },
                {
                  pre: t("theater_academy_group_ostrov_post1"),
                  bold: t("theater_academy_group_ostrov_bold"),
                  post: t("theater_academy_group_ostrov_post2"),
                },
                {
                  pre: t("theater_academy_group_klass_post1"),
                }
              ].map((item, index) => (
                <li key={index}>
                  {item.pre}
                  <strong> {item.bold} </strong>
                  {item.post}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.textContainer}>
            <h4>{t("theater_academy_theater_studios")}</h4>
            <ul className={styles.list}>
              {[
                {
                  pre: t("theater_academy_theater_scarlet_sails_post1"),
                  bold: t("theater_academy_theater_scarlet_sails_bold"),
                  post: t("theater_academy_theater_scarlet_sails_post2"),
                },
                {
                  pre: t("theater_academy_theater_new_hero_post1"),
                  bold: t("theater_academy_theater_new_hero_bold"),
                  post: t("theater_academy_theater_new_hero_post2"),
                },
                {
                  pre: t("theater_academy_theater_life_post1"),
                  bold: t("theater_academy_theater_life_bold"),
                  post: t("theater_academy_theater_life_post2"),
                },
                {
                  pre: t("theater_academy_theater_art_post1"),
                  bold: t("theater_academy_theater_art_bold"),
                  post: t("theater_academy_theater_art_post2"),
                },
                {
                  pre: t("theater_academy_theater_actor_post1"),
                  bold: t("theater_academy_theater_actor_bold"),
                  post: t("theater_academy_theater_actor_post2"),
                },
               
              ].map((item, index) => (
                <li key={index}>
                  {item.pre}
                  <strong> {item.bold} </strong>
                  {item.post}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
  );
}
