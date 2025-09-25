import TheaterAcademy from "@/components/ads/education/TheaterAcademy";
import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/AdsPage.module.css";
import { useState } from "react";
// import EasterEggById from "@/components/EasterEggById";
import EnglishLessons from "@/components/ads/education/EnglishLessons";
import KidsClub from "@/components/ads/education/KidsClub";

export default function AnnouncementsPage() {
  const t = useTranslation();

  const [announcementGroups] = useState([
    {
      id: 1,
      type: "single",
      components: [<KidsClub key="tutor" />],
    },
    {
      id: 2,
      type: "single",
      components: [<TheaterAcademy key="tutor" />],
    },
    {
      id: 3,
      type: "single",
      components: [<EnglishLessons key="tutor" />],
    },
  ]);

  return (
    <>
      <Seo title={t("meta.ads_studios_title")} description={t("meta.ads_studios_description")} />
      <div className={styles.container}>
        <h2 className={styles.title}>{t("menu.ads_studios")}</h2>

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
      {/* <EasterEggById id="easteregg-articles" chance={0.5} /> */}
    </>
  );
}
