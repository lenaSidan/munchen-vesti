import { useRouter } from "next/router";
import { getEventsByLocale, Event } from "@/lib/getEvents";
import Link from "next/link";
import { GetStaticProps } from "next";
import useTranslation from "@/hooks/useTranslation";
import Seo from "@/components/Seo";

interface EventsProps {
  events: Event[];
}

export default function Events({ events }: EventsProps) {
  const t = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <Seo title={t("meta.all_events_title")} description={t("meta.all_events_description")} />
      <h1>{t("meta.all_events_title")}</h1>
      <div>
        <h2>{locale === "ru" ? "Статьи" : "Event"}</h2>
        {events.map((event) => (
          <div key={event.slug}>
            <h3>{event.title}</h3>
            <p>
              {event.time && ` – ${event.time}`}

              {event.ort && ` | ${event.ort}`}
            </p>
            <Link href={`/events/${event.slug}`}>
              <button type="button">{t("title.read_more")}</button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
  const events = getEventsByLocale(locale || "ru");
  return { props: { events } };
};
