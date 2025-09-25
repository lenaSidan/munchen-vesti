import styles from "@/components/ads/education/kidsClub.module.css";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function KidsClub() {
  const t = useTranslation();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.decorativeLine}></div>

      <h2 className={styles.title}>{t("kids_club_title")}</h2>
      <div className={styles.subtitleBox}>
        <p className={styles.description}>{t("kids_club_start_date")}</p>
      </div>

      <div className={styles.adsBox}>
        <div className={styles.adsContainer}>
          <div className={styles.textBox}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/kids_Club.webp"
                alt={t("kids_club_title")}
                className={styles.image}
                width={400}
                height={200}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <div className={styles.textContainer}>
              <p className={styles.text1}>{t("kids_club_paragraph1")}</p>
              <p className={styles.text2}>{t("kids_club_paragraph2")}</p>
            </div>
          </div>

          <div className={styles.textContainerLeft}>
            <div className={styles.left}>
              <h4>{t("kids_club_schedule_title")}</h4>
              <ul className={styles.list}>
                <li>{t("kids_club_schedule_group1")}</li>
                <li>{t("kids_club_schedule_group2")}</li>
              </ul>
            </div>
            <div className={styles.right}>
              <div className={styles.contactBox}>
                <div className={styles.link}>
                  <p className={styles.label}>{t("kids_club_location_label")}</p>
                  <p className={styles.value}>{t("kids_club_location")}</p>
                </div>

                <div className={styles.link}>
                  <p className={styles.label}>{t("kids_club_price_label")}</p>
                  <div>
                    <p className={styles.value}>{t("kids_club_price")}</p>
                  </div>
                </div>
                <div className={styles.link}>
                  <span className={styles.label}>{t("kids_club_contact")} </span>
                  <Link className={styles.value} href="tel:+491510235568">
                    +49 1510 235568
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.decorativeLine}></div>
    </div>
  );
}
