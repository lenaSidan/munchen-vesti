import { DailyWeather } from "@/lib/getWeather";
import { getWeatherIcon } from "@/lib/weatherUtils";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/WeatherInline.module.css";
import Image from "next/image";

export default function WeatherInlineBlock({ forecast }: { forecast: DailyWeather }) {
  const t = useTranslation();

  return (
    <div className={styles.weatherBox}>
      <h4>{t("weather.title")}</h4>
      <ul>
        {forecast.time.slice(0, 4).map((date, i) => (
          <li key={date}>
            <strong>
              {new Date(date).toLocaleDateString(t("locale"), {
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
    </div>
  );
}
