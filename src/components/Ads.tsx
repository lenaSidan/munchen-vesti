import styles from "@/styles/Ads.module.css";
import TibetanBowls from "./ads/TibetanBowls";
import SalonRental from "./ads/SalonRental";


export default function Ads() {
  return (
    <aside className={styles.announcements}>
      <TibetanBowls />
      <SalonRental />
      {/* <LegalServices /> */}
    </aside>
  );
}
