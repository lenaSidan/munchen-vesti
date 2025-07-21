import styles from "@/styles/MiniCalendarBlock.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const weekdaysMap: Record<string, string[]> = {
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
};

const today = new Date();

function getMonthDays(year: number, month: number) {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay(); // 0 (вс) – 6 (сб)
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < offset; i++) days.push(null); // пустые ячейки

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return days;
}

export default function MiniCalendarBlock() {
  const { locale } = useRouter();
  const lang = locale === "de" ? "de-DE" : "ru-RU";
  const weekdays = weekdaysMap[locale === "de" ? "de" : "ru"];

  const monthDays = getMonthDays(today.getFullYear(), today.getMonth());

  return (
    <Link href="/calendar" className={styles.calendarLink}>
      <div className={styles.calendarContainer}>
        <div className={styles.title}>
          {locale === "de" ? "Kalender der Veranstaltungen" : "Календарь мероприятий"}
        </div>
        <div className={styles.header}>
          <span className={styles.month}>
            {today.toLocaleString(lang, { month: "long" })} {today.getFullYear()}
          </span>
        </div>
        <div className={styles.grid}>
          {weekdays.map((w) => (
            <div key={w} className={styles.weekday}>
              {w}
            </div>
          ))}
          {monthDays.map((day, idx) => (
            <div
              key={idx}
              className={`${styles.day} ${day === today.getDate() ? styles.today : ""}`}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
