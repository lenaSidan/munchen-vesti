import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import SalonRental from "@/components/ads/SalonRental";


export default function AnnouncementsPage() {
  const t = useTranslation();

  const [announcementGroups] = useState([
   
    {
      id: 5,
      type: "single",
      components: [<SalonRental key="salonRental" />],
    },
   
  ]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("menu.ads_other")}</h2>

      <div className={styles.announcementsWrapper}>
        {announcementGroups.map((group) => (
          <div key={group.id} className={`${styles.announcementGroup} ${styles[group.type]}`}>
            {group.components.map((component, index) => (
              <div key={index} className={styles.announcementBox}>
                {component}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
