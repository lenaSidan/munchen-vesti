import { DailyWeather } from "@/lib/getWeather";
import { getWeatherIcon } from "@/lib/weatherUtils";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/WeatherInline.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function WeatherInlineBlock({ forecast }: { forecast: DailyWeather }) {
  const t = useTranslation();
  const { locale } = useRouter();

  return (
    <Link href="/weather-page" className={styles.weatherBox}>
      <h4>{t("weather.title")}</h4>
      <ul>
        {forecast.time.slice(0, 4).map((date, i) => (
          <li key={date}>
            <strong>
              {new Date(date).toLocaleDateString(locale, {
                weekday: "short",
                day: "numeric",
                month: "long",
              })}
            </strong>
            {Math.round(forecast.temperature_2m_min[i])}–{Math.round(forecast.temperature_2m_max[i])}°C
            <Image
              src={getWeatherIcon(forecast.weathercode[i])}
              alt="weather icon"
              className={styles.weatherIcon}
              width={30}
              height={30}
            />
          </li>
        ))}
      </ul>
      <div className={styles.weatherLinkHint}>{t("weather.more")} →</div>
    </Link>
  );
}
