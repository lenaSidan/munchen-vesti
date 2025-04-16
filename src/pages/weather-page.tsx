import { GetStaticProps } from "next";
import { getWeatherForecast, DailyWeather } from "@/lib/getWeather";
import styles from "@/styles/Weather.module.css";
import { getWeatherIcon } from "@/lib/weatherUtils";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  weather: DailyWeather | null;
}

export default function WeatherPage({ weather }: Props) {
  const t = useTranslation();
  const { locale } = useRouter();

  if (!weather) return <p>{t("weather.error_loading")}</p>;

  return (
    <section className={styles.weatherBlock}>
      <h2 className={styles.weatherTitle}>{t("weather.title")}</h2>
      <ul className={styles.weatherList}>
        {weather.time.map((date, i) => (
          <li key={date} className={styles.weatherItem}>
            <div className={styles.weatherHeader}>
              <span className={styles.weatherDate}>
                {new Date(date).toLocaleDateString(locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <Image
                src={getWeatherIcon(weather.weathercode[i])}
                alt="weather icon"
                className={styles.weatherIcon}
                width={32}
                height={32}
              />
            </div>
            <div className={styles.weatherDetails}>
              <div className={styles.temp}>
                <span className={styles.min}>↓ {weather.temperature_2m_min[i]}°C</span>
                <span className={styles.max}>↑ {weather.temperature_2m_max[i]}°C</span>
              </div>
              <span className={styles.precip}>
                {t("weather.precip")}: {weather.precipitation_sum[i]} мм
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const weather = await getWeatherForecast();
  return {
    props: { weather },
    revalidate: 43200,
  };
};
