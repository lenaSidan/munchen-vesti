import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import LegalServices from "@/components/ads/LegalServices";
import TutorNeeded from "@/components/ads/TutorNeeded";
import TheaterAcademy from "@/components/ads/TheaterAcademy";
import PsychologistTatjana from "@/components/ads/PsychologistTatjana";
import BeautySalon from "@/components/ads/BeautySalon";

export default function AnnouncementsPage() {
  const t = useTranslation();

  const [announcementGroups] = useState([
    {
      id: 1,
      type: "single",
      components: [<TheaterAcademy key="tutor" />],
    },
    {
      id: 4,
      type: "triple2",
      components: [<TutorNeeded key="tutor3" />, <LegalServices key="legal2" />, <PsychologistTatjana key="tutor4" />],
    },

    {
      id: 3,
      type: "triple",
      components: [<TutorNeeded key="tutor3" />, <TutorNeeded key="legal2" />, <TutorNeeded key="tutor4" />],
    },
    {
      id: 2,
      type: "double",
      components: [<BeautySalon key="legal" />, <PsychologistTatjana key="psychologist" />],
    },
  ]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("menu.ads")}</h2>

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
