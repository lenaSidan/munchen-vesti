import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import { Event, getPastEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/PastEvents.module.css";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

interface EventsProps {
  events: Event[];
}

export default function PastEvents({ events }: EventsProps) {
  const t = useTranslation();

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Seo title={t("meta.past_events_title")} description={t("meta.past_events_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.past_events_title")}</h1>
      <div className={styles.articleContainer}>
        <h2 className={styles.title}>{t("past_events_heading")}</h2>
        <div className={styles.eventCardBox}>
          {events.map((event, index) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className={`${styles.eventCard} ${index % 2 === 0 ? styles.evenCard : styles.oddCard}`}
            >
              <div className={styles.imageTitleWrapper}>
                {/* {event.image && (
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={158}
                    height={90}
                    className={styles.smallImage}
                  />
                )} */}
                <div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDetails}>{event.time}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
          <div className={styles.backToHome}>
          <Link href="/events" className={styles.backLink}>
            ⬅ {t("articles.back")}
          </Link>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
  const allPastEvents = getPastEventsByLocale(locale || "ru");

  const sorted = allPastEvents.sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();
    return dateB - dateA; // от новых к старым
  });

  return {
    props: {
      events: sorted,
    },
    revalidate: 43200,
  };
};
