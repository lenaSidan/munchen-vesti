import styles from "@/styles/Announcements.module.css";
import LegalServices from "./announcements/LegalServices";
import TutorNeeded from "./announcements/TutorNeeded";

export default function Announcements() {
  return (
    <aside className={styles.announcements}>
      <TutorNeeded />
      <LegalServices />
    </aside>
  );
}
