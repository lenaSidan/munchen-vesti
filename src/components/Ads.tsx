import styles from "@/styles/Ads.module.css";

import TutorNeeded from "./ads/TutorNeeded";
import TheaterAcademyMainPage from "./ads/TheaterAcademyMainPage";

export default function Ads() {
  return (
    <aside className={styles.announcements}>
      <TheaterAcademyMainPage />
      <TutorNeeded />
      {/* <LegalServices /> */}
    </aside>
  );
}
