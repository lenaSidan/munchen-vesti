import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import PsychologistTatjana from "@/components/ads/PsychologistTatjana";
import BeautySalon from "@/components/ads/BeautySalon";
import VitaJewelry from "@/components/ads/VitaJewelry";
import TibetanBowls from "@/components/ads/TibetanBowls";
import LettaBeauty from "@/components/ads/LettaBeauty";
import HairSalonAd from "@/components/ads/HairSalon";
import PureBeautySalon from "@/components/ads/PureBeautySalon";
import Seo from "@/components/Seo";

export default function AnnouncementsPage() {
  const t = useTranslation();

  const [announcementGroups] = useState([
    {
      id: 1,
      type: "double",
      components: [<VitaJewelry key="vetaJewelry" />, <TibetanBowls key="tibetanBowls" />],
    },

    {
      id: 2,
      type: "single",
      components: [<PureBeautySalon key="pureBeauty" />],
    },
    {
      id: 3,
      type: "double",
      components: [<BeautySalon key="legal" />, <PsychologistTatjana key="psychologist" />],
    },
    {
      id: 4,
      type: "double",
      components: [<HairSalonAd key="hairSalon" />, <LettaBeauty key="lettaBeauty" />],
    },
  ]);

  return (
    <>
      <Seo title={t("meta.ads_services_title")} description={t("meta.ads_services_description")} />

      <div className={styles.container}>
        <h3 className={styles.title}>{t("menu.ads_services")}</h3>

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
