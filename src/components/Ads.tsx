import styles from "@/styles/Ads.module.css";
import ViletaJewelry from "./ads/VitaJewelry";

export default function Ads() {
  return (
    <aside className={styles.announcements}>
      <ViletaJewelry />
    </aside>
  );
}
