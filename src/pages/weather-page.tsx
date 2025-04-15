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
            <span className={styles.weatherDate}>
              {new Date(date).toLocaleDateString(locale, {
                weekday: "short",
                day: "numeric",
                month: "long",
              })}
            </span>
            <span className={styles.weatherDetails}>
              {weather.temperature_2m_min[i]}°C – {weather.temperature_2m_max[i]}°C, {t("weather.precip")}{" "}
              {weather.precipitation_sum[i]} мм
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
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const weather = await getWeatherForecast();
  return {
    props: { weather },
    revalidate: 43200, // обновляется каждые 12 часов
  };
};
