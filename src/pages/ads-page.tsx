import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import TheaterAcademy from "@/components/ads/TheaterAcademy";
import PsychologistTatjana from "@/components/ads/PsychologistTatjana";
import BeautySalon from "@/components/ads/BeautySalon";
import VitaJewelry from "@/components/ads/VitaJewelry";
import TibetanBowls from "@/components/ads/TibetanBowls";
import LettaBeauty from "@/components/ads/LettaBeauty";
import SalonRental from "@/components/ads/SalonRental";
import HairSalonAd from "@/components/ads/HairSalon";
import TomatePizzaAd from "@/components/ads/TomatePizza";

export default function AnnouncementsPage() {
  const t = useTranslation();

  const [announcementGroups] = useState([
    {
      id: 1,
      type: "single",
      components: [<TheaterAcademy key="tutor" />],
    },
    // {
    //   id: 4,
    //   type: "triple2",
    //   components: [<HairSalonAd key="tutor3" />, <VitaJewelry key="vetaJewelry" />, <BeautySalon key="legal" />],
    // },
    {
      id: 2,
      type: "double",
      components: [<HairSalonAd key="hairSalon" />, <TomatePizzaAd key="hairSalon" />],
    },
    {
      id: 4,
      type: "double",
      components: [<VitaJewelry key="vetaJewelry" />, <TibetanBowls key="tibetanBowls" />],
    },
    {
      id: 5,
      type: "single",
      components: [<SalonRental key="salonRental" />],
    },
    // {
    //   id: 3,
    //   type: "triple",
    //   components: [<TutorNeeded key="tutor3" />, <TutorNeeded key="legal2" />, <TutorNeeded key="tutor4" />],
    // },
    {
      id: 2,
      type: "double",
      components: [<BeautySalon key="legal" />, <PsychologistTatjana key="psychologist" />],
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
