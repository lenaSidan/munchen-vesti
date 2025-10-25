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
  return (
    <div className={styles.monthSelectContainer}>
      <label htmlFor="monthSelect">{label}</label>
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
    </div>
  );
}
