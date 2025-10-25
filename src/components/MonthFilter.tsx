import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/EventsPageNew.module.css";

interface MonthFilterProps {
  label: string;
  selectedMonthYear: string;
  monthYearOptions: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export default function MonthFilter({
  label,
  selectedMonthYear,
  monthYearOptions,
  onChange,
}: MonthFilterProps) {
  const currentIndex = monthYearOptions.findIndex((m) => m.value === selectedMonthYear);

  const handlePrev = () => {
    if (currentIndex > 0) onChange(monthYearOptions[currentIndex - 1].value);
  };

  const handleNext = () => {
    if (currentIndex < monthYearOptions.length - 1)
      onChange(monthYearOptions[currentIndex + 1].value);
  };

  return (
    <div className={styles.monthSelectWrapper}>
      <label htmlFor="monthSelect" className={styles.monthLabel}>
        {label}
      </label>

      <div className={styles.monthControls}>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          title="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <select
          id="monthSelect"
          value={selectedMonthYear}
          onChange={(e) => onChange(e.target.value)}
          className={styles.monthSelect}
        >
          {monthYearOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={styles.arrowButton}
          onClick={handleNext}
          disabled={currentIndex >= monthYearOptions.length - 1}
          title="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
