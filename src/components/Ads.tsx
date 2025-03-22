import styles from "@/styles/Ads.module.css";
import TibetanBowls from "./ads/TibetanBowls";

export default function Ads() {
  return (
    <aside className={styles.announcements}>
      <TibetanBowls />
    </aside>
  );
}
