import styles from "@/styles/Ads.module.css";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import TibetanBowls from "./ads/services/TibetanBowls";
import SalonRental from "./ads/other/SalonRental";

export default function Ads() {
  const t = useTranslation();

  return (
    <aside className={styles.announcements}>
      <div className={styles.announcementHeader}>
        <h3 className={styles.announcementTitle}>{t("info")}</h3>
        <Image
          src="/icons/info.png"
          alt="Info"
          width={20}
          height={20}
          className={`${styles.announcementIcon} ${styles.info}`}
        />
      </div>
      <div className={styles.decorativeLine}></div>
      <TibetanBowls />
      <SalonRental />
    </aside>
  );
}
