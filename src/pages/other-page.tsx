import SalonRental from "@/components/ads/other/SalonRental";
import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/AdsPage.module.css";
import { useState } from "react";

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
    <>
      <Seo title={t("meta.ads_other_title")} description={t("meta.ads_other_description")} />

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
    </>
  );
}
