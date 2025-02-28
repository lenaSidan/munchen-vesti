import styles from "@/styles/Announcements.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function TutorNeeded() {
  const t = useTranslation();
  
  return (
    <div className={`${styles.announcementItem} ${styles.tutor}`}>
      <h3>{t("tutor_needed_title")}</h3>
      <p>{t("tutor_needed_text")}</p>
    </div>
  );
}
