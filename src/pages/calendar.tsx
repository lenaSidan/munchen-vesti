import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/CalendarPage.module.css";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

interface CalendarProps {
  events: Event[];
}

export default function CalendarPage({ events }: CalendarProps) {
  const t = useTranslation();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const hoveringModalRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const daysInMonth = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    const days = [];
    const startDay = (date.getDay() + 6) % 7;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    return days;
  }, [currentMonth, currentYear]);

  const eventsByDate = useMemo(() => {
    const map: { [key: string]: (Event & { _calendarSegment?: "start" | "middle" | "end" })[] } =
      {};

    for (const event of events) {
      const start = new Date(event.calendarStartDate ?? event.date!);
      const end = new Date(event.calendarEndDate ?? event.calendarStartDate ?? event.date!);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const current = new Date(start);
      while (current <= end) {
        const key = current.toISOString().split("T")[0];
        if (!map[key]) map[key] = [];

        map[key].push({
          ...event,
          _calendarSegment:
            current.getTime() === start.getTime()
              ? "start"
              : current.getTime() === end.getTime()
                ? "end"
                : "middle",
        });
        current.setDate(current.getDate() + 1);
      }
    }

    return map;
  }, [events]);

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  return (
    <div className={styles.calendarPage}>
      <div className={styles.header}>
        <button onClick={goToPreviousMonth}>←</button>
        <h2>
          {t(
            `months.${new Date(currentYear, currentMonth)
              .toLocaleString("en", { month: "long" })
              .toLowerCase()}`
          )}{" "}
          {currentYear}
        </h2>
        <button onClick={goToNextMonth}>→</button>
      </div>

      <div className={styles.grid}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className={styles.dayName}>
            {d}
          </div>
        ))}

        {daysInMonth.map((date, index) => {
          const key = date?.toISOString().split("T")[0];
          const dayEvents = key && eventsByDate[key];
          const isPast = !!date && date.getTime() < new Date().setHours(0, 0, 0, 0);

          return (
            <div key={index} className={`${styles.dayCell} ${isPast ? styles.pastDay : ""}`}>
              {date && (
                <>
                  <div className={styles.dayNumber}>{date.getDate()}</div>
                  {Array.isArray(dayEvents) &&
                    dayEvents.map((event) => {
                      const segment = event._calendarSegment;
                      const segmentClass =
                        segment === "start"
                          ? styles.eventStart
                          : segment === "end"
                            ? styles.eventEnd
                            : styles.eventMiddle;

                      return (
                        <div
                          key={`${event.slug}-${key}`}
                          className={`${styles.eventBar} ${segmentClass}`}
                          onMouseEnter={(e) => {
                            if (!isMobile) {
                              hoveringModalRef.current = true;
                              if (timeoutRef.current) clearTimeout(timeoutRef.current);
                              const rect = e.currentTarget.getBoundingClientRect();
                              setModalPosition({
                                top: rect.bottom + window.scrollY + 8,
                                left: rect.left + window.scrollX,
                              });
                              setSelectedEvent(event);
                            }
                          }}
                          onClick={() => {
                            if (isMobile) {
                              setSelectedEvent(event);
                            }
                          }}
                          onMouseLeave={() => {
                            if (!isMobile) {
                              timeoutRef.current = setTimeout(() => {
                                if (!hoveringModalRef.current) setSelectedEvent(null);
                              }, 300);
                            }
                          }}
                        >
                          {segment !== "middle" && (
                            <span className={styles.eventTitleSmall}>{event.shortTitle}</span>
                          )}
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedEvent &&
        (isMobile ? (
          <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
            <div className={styles.eventModalMobile} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalBox}>
                <p className={styles.modalTitle}>{selectedEvent.shortTitle}</p>
                {selectedEvent.ort && <p className={styles.modalOrt}>{selectedEvent.ort}</p>}
                {selectedEvent.ort && <p className={styles.modalTime}>{selectedEvent.time}</p>}
                <Link
                  href={`/events/${selectedEvent.slug}`}
                  onClick={() => {
                    sessionStorage.setItem("fromCalendar", "true");
                  }}
                >
                  {t("articles.more")}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={styles.eventModal}
            style={{ top: modalPosition.top, left: modalPosition.left }}
            onMouseEnter={() => {
              hoveringModalRef.current = true;
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={() => {
              hoveringModalRef.current = false;
              timeoutRef.current = setTimeout(() => {
                if (!hoveringModalRef.current) setSelectedEvent(null);
              }, 300);
            }}
          >
            <div className={styles.modalBox}>
              <p className={styles.modalTitle}>{selectedEvent.shortTitle}</p>
              {selectedEvent.ort && <p className={styles.modalOrt}>{selectedEvent.ort}</p>}
              {selectedEvent.ort && <p className={styles.modalTime}>{selectedEvent.time}</p>}
              <Link
                className={styles.modalLink}
                href={`/events/${selectedEvent.slug}`}
                onClick={() => {
                  sessionStorage.setItem("fromCalendar", "true");
                }}
              >
                {t("articles.more")}
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<CalendarProps> = async ({ locale }) => {
  const rawEvents = getEventsByLocale(locale || "ru");
  const events = rawEvents.filter((e) => !!e.date);
  return { props: { events } };
};
