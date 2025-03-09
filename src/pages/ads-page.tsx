import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import TutorNeeded from "@/components/ads/TutorNeeded";
import TheaterAcademy from "@/components/ads/TheaterAcademy";
import PsychologistTatjana from "@/components/ads/PsychologistTatjana";
import BeautySalon from "@/components/ads/BeautySalon";
import VitaJewelry from "@/components/ads/VitaJewelry";
import TibetanBowls from "@/components/ads/TibetanBowls";
import LettaBeauty from "@/components/ads/LettaBeauty";

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
      components: [<TutorNeeded key="tutor3" />, <VitaJewelry key="vetaJewelry" />, <BeautySalon key="legal" />],
    },

    {
      id: 3,
      type: "triple",
      components: [<TutorNeeded key="tutor3" />, <TutorNeeded key="legal2" />, <TutorNeeded key="tutor4" />],
    },
    {
      id: 2,
      type: "double",
      components: [<TibetanBowls key="tibetanBowls" />, <PsychologistTatjana key="psychologist" />],
    },
    {
      id: 5,
      type: "single",
      components: [<LettaBeauty key="lettaBeauty" />],
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
