import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import TheaterAcademy from "@/components/ads/TheaterAcademy";
import Seo from "@/components/Seo";

export default function AnnouncementsPage() {
  const t = useTranslation();

  const [announcementGroups] = useState([
    {
      id: 1,
      type: "single",
      components: [<TheaterAcademy key="tutor" />],
    },
  ]);

  return (
    <>
      <Seo title={t("meta.ads_studios_title")} description={t("meta.ads_studios_description")} />
      <div className={styles.container}>
        <h3 className={styles.title}>{t("menu.ads_studios")}</h3>

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
