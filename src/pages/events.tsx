import { useRouter } from "next/router";
import { getEventsByLocale, Event } from "@/lib/getEvents"; // ✅ Импортируем интерфейс
import Link from "next/link";
import { GetStaticProps } from "next";
import useTranslation from "@/hooks/useTranslation";


interface EventsProps {
  events: Event[]; // ✅ Теперь используем тот же Event, что и в getEvents.ts
}

export default function Events({ events }: EventsProps) {
  const t = useTranslation();
  const { locale } = useRouter();

  
  return (
    <div>
      <h1>{locale === "ru" ? "Статьи" : "Event"}</h1>
      {events.map((event) => (
        <div key={event.slug}>
          <h2>{event.title}</h2>
          <p>{event.date}</p>
          <p>{event.author}</p>
          <Link href={`/events/${event.slug}`}>
            <button type="button">{t("menu.read_more")}</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<EventsProps> = async ({ locale }) => {
  const events = getEventsByLocale(locale || "ru");
  return { props: { events } };
};

