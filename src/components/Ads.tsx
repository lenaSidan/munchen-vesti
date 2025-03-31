import styles from "@/styles/Ads.module.css";
import ViletaJewelry from "./ads/VitaJewelry";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";

export default function Ads() {
  const t = useTranslation();

  return (
    <aside className={styles.announcements}>
      <div className={styles.announcementHeader}>
        <h2 className={styles.announcementTitle}>{t("info")}</h2>
        <Image
          src="/icons/info.png"
          alt="Info"
          width={20}
          height={20}
          className={`${styles.announcementIcon} ${styles.info}`}
        />
      </div>
      <div className={styles.decorativeLine}></div>
      <ViletaJewelry />
    </aside>
  );
}
