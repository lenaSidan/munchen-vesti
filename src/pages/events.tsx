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
      <div>
        <h1>{locale === "ru" ? "Статьи" : "Event"}</h1>
        {events.map((event) => (
          <div key={event.slug}>
            <h2>{event.title}</h2>
            <p>
              {event.time && ` – ${event.time}`}

              {event.ort && ` | ${event.ort}`}
            </p>
            <Link href={`/events/${event.slug}`}>
              <button type="button">{t("menu.read_more")}</button>
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
