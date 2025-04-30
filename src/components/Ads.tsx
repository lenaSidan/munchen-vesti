import styles from "@/styles/Ads.module.css";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import WeatherInlineBlock from "./WeatherInlineBlock";
import { DailyWeather } from "@/lib/getWeather";
import HairSalonAd from "@/components/ads/services/HairSalon";

export default function Ads({ weather }: { weather: DailyWeather | null }) {
  const t = useTranslation();

  return (
    <aside className={styles.announcements}>
      {weather && <WeatherInlineBlock forecast={weather} />}
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

      <HairSalonAd />
    </aside>
  );
}
