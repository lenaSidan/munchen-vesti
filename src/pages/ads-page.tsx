import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import LegalServices from "@/components/ads/LegalServices";
import TutorNeeded from "@/components/ads/TutorNeeded";

export default function AnnouncementsPage() {
  const t = useTranslation();
  
  const [announcementGroups] = useState([
    { 
      id: 1, 
      type: "single",
      components: [<TutorNeeded key="tutor" />] 
    },
    { 
      id: 2, 
      type: "double", 
      components: [<LegalServices key="legal" />, <TutorNeeded key="tutor2" />] 
    },
    { 
      id: 3, 
      type: "triple",
      components: [
        <TutorNeeded key="tutor3" />, 
        <LegalServices key="legal2" />, 
        <TutorNeeded key="tutor4" />
      ] 
    }
  ]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("menu.announcements")}</h2>

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