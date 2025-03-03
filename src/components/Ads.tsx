import styles from "@/styles/Ads.module.css";
import LegalServices from "./ads/LegalServices";
import TutorNeeded from "./ads/TutorNeeded";

export default function Ads() {
  return (
    <aside className={styles.announcements}>
      <TutorNeeded />
      <LegalServices />
    </aside>
  );
}
