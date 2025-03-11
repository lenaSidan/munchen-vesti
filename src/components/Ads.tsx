import styles from "@/styles/Ads.module.css";
import TheaterAcademyMainPage from "./ads/TheaterAcademyMainPage";


export default function Ads() {
  return (
    <aside className={styles.announcements}>
      <TheaterAcademyMainPage />
      
      {/* <LegalServices /> */}
    </aside>
  );
}
