// pages/weather.tsx
import { GetStaticProps } from "next";
import { getWeatherForecast, DailyWeather } from "@/lib/getWeather";
import styles from "@/styles/Weather.module.css";
import { getWeatherIcon } from "@/lib/weatherUtils";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

interface Props {
  weather: DailyWeather | null;
}

export default function WeatherPage({ weather }: Props) {
  const t = useTranslation();
  const { locale } = useRouter();

  if (!weather) return <p>{t("weather.error_loading")}</p>;

  const avgTemp = Math.round(
    (weather.temperature_2m_min.reduce((sum, temp) => sum + temp, 0) +
      weather.temperature_2m_max.reduce((sum, temp) => sum + temp, 0)) /
      (weather.temperature_2m_min.length + weather.temperature_2m_max.length)
  );

  const hottestIndex = weather.temperature_2m_max.indexOf(Math.max(...weather.temperature_2m_max));
  const wettestIndex = weather.precipitation_sum.indexOf(Math.max(...weather.precipitation_sum));

  const hottestDate = new Date(weather.time[hottestIndex]).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  const wettestDate = new Date(weather.time[wettestIndex]).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  return (
    <div className={styles.weatherBox}>
      <section className={styles.weatherBlock}>
        <h2 className={styles.weatherTitle}>{t("weather.title")}</h2>
        <div className={styles.weatherContent}>
          <ul className={styles.weatherList}>
            {weather.time.map((date, i) => (
              <li key={date} className={`${styles.weatherItem} ${styles[`delay${i}`]}`}>
                <span className={styles.weatherDate}>
                  {new Date(date).toLocaleDateString(locale, {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className={styles.weatherDetails}>
                  <span className={styles.tempMin}>↓ {weather.temperature_2m_min[i]}°C</span>
                  <span className={styles.tempMax}>↑ {weather.temperature_2m_max[i]}°C</span>
                  <span className={styles.precip}>
                    {t("weather.precip")}: {weather.precipitation_sum[i]} мм
                  </span>
                  <Image
                    src={getWeatherIcon(weather.weathercode[i])}
                    alt="weather icon"
                    className={styles.weatherIcon}
                    width={30}
                    height={30}
                  />
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.weatherInfoBox}>
            <p className={styles.weatherText}>
              <span className={styles.weatherEm}>
                🌡 <em>{t("weather.average_temperature")}</em> <strong>{avgTemp}°C</strong>
              </span>
            </p>
            
            <p className={styles.weatherText}>
              <span className={styles.weatherEm}>
                ☀ <em>{t("weather.warmest_day")}</em> <strong>{hottestDate}</strong>
              </span>
            </p>
            <p className={styles.weatherText}>
              <span className={styles.weatherEm}>
                🌧 <em>{t("weather.most_precipitation")}</em> <strong>{wettestDate}</strong>
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className={styles.backToHome}>
        <Link href="/" className={styles.backLink}>
          ⬅ {t("weather.back_to_home")}
        </Link>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const weather = await getWeatherForecast();
  return {
    props: { weather },
    revalidate: 43200,
  };
};
