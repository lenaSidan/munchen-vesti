import BavarianWordOfTheWeek from "@/components/BavarianWordOfTheWeek";
import MiniCalendarBlock from "@/components/MiniCalendarBlock";
import MiniPostcardsMobile from "@/components/MiniPostcardsMobile";
import MobileHighlight from "@/components/MobileHighlight";
import MobileImportantNews from "@/components/MobileImportantNews";

import SubscribeBox from "@/components/SubscribeBox";
import WeatherInlineBlock from "@/components/WeatherInlineBlock";
import useTranslation from "@/hooks/useTranslation";
import { Event } from "@/lib/getEvents";
import { DailyWeather } from "@/lib/getWeather";
import styles from "@/styles/HomeMobile.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const LazyShortNewsBlock = dynamic(() => import("@/components/ShortNewsBlock"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const LazyLegalAdviceBlock = dynamic(
  () => import("@/components/LegalAdviceBlock"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
interface LiteEvent extends Event {
  excerptHtml?: string;
}

interface HomeMobileProps {
  mainEvent: LiteEvent | null;
  weather: DailyWeather | null;
  oldWords: any[];
  otherEvents: LiteEvent[];
}

export default function HomeMobile({ mainEvent, weather, oldWords, otherEvents }: HomeMobileProps) {
  const t = useTranslation();

  // Утилита для короткого текста (fallback)
  function getExcerpt(text: string, limit = 180) {
    if (!text) return "";
    const plain = text
      .replace(/<[^>]+>/g, "") // убираем HTML-теги
      .replace(/\n+/g, " ")
      .trim();
    return plain.length > limit ? plain.slice(0, limit) + "…" : plain;
  }

  return (
    <div className={styles.mobileContainer}>
      {/* 🔹 Главный анонс */}
      {mainEvent && (
        <section className={styles.mobileHero}>
          <div className={styles.mobileSectionTitleTop}>
            {t("home.featured_event") || "Актуальное событие"}
          </div>
          {mainEvent.image && (
            <Image
              src={mainEvent.image}
              alt={mainEvent.title}
              width={800}
              height={450}
              className={styles.mobileHeroImage}
              priority
            />
          )}
          {mainEvent.time && <p className={styles.mobileHeroDate}>{mainEvent.time}</p>}
          <h2 className={styles.mobileHeroTitle}>{mainEvent.title}</h2>

          <div className={styles.decorativeLine}></div>
          {/* 🔹 Короткий анонс */}
          {mainEvent.excerptHtml ? (
            <div
              className={styles.mobileHeroText}
              dangerouslySetInnerHTML={{ __html: mainEvent.excerptHtml }}
            />
          ) : (
            <p className={styles.mobileHeroText}>
              {getExcerpt(mainEvent.content) || t("home.mainEvent_intro")}
            </p>
          )}

          <Link
            href={`/events-page#${
              Array.isArray(mainEvent.fileId) ? mainEvent.fileId[0] : mainEvent.fileId
            }`}
            className={styles.mobileHeroLink}
          >
            {t("home.read_more")} →
          </Link>
        </section>
      )}

      {/* 🔹 Короткие анонсы мероприятий */}
      {otherEvents?.length > 0 && (
        <section className={styles.mobileEvents}>
          <h3 className={styles.mobileSectionTitle}>{t("home.view_all_articles")}</h3>

          <ul className={styles.mobileEventsList}>
            {otherEvents.slice(0, 3).map((event) => (
              <li key={event.slug.toString()} className={styles.mobileEventItem}>
                <Link
                  href={`/events-page#${
                    Array.isArray(event.fileId) ? event.fileId[0] : event.fileId
                  }`}
                  className={styles.mobileEventLink}
                >
                  <span className={styles.mobileEventTitle}>{event.title}</span>
                  {event.time && <span className={styles.mobileEventTime}>{event.time}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/events-page" className={styles.mobileMoreLink}>
            {t("home.view_articles")} →
          </Link>
        </section>
      )}
      {/* <section className={styles.mobileHighlightSection}>
        <MobileHighlight />
      </section> */}
      {/* 🔹 Одна короткая новость */}
      <section className={styles.mobileNews}>
        <LazyShortNewsBlock limit={1} />
        <Link href="/news-page" className={styles.mobileMoreLink}>
          {t("news.go_to_newsPage")} →
        </Link>
      </section>
      {/* 🔹 Юридические советы (рандомно) */}
      <section className={styles.mobileLegalAdvice}>
        <LazyLegalAdviceBlock limit={1} />
        <Link href="/useful-page" className={styles.mobileMoreLink}>
          {t("legal.go_to_legalAdvice")} →
        </Link>
      </section>
      {/* 🔹 Календарь и погода */}
      <section className={styles.mobileCalendarWeather}>
        <MiniCalendarBlock />
        {weather && <WeatherInlineBlock forecast={weather} />}
      </section>

      {/* 🔹 Баварское слово */}
      <section className={styles.mobileWord}>
        <BavarianWordOfTheWeek words={oldWords.slice(0, 1)} />
      </section>
      <div>
        <MobileImportantNews />
      </div>
      {/* 🔹 Мини-открытки */}
      <section className={styles.mobilePostcards}>
        <MiniPostcardsMobile />
      </section>
      <section className={styles.mobileSubscribeBox}>
        <SubscribeBox />
      </section>
    </div>
  );
}
