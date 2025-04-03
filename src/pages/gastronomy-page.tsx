import { useState } from "react";
import styles from "@/styles/AdsPage.module.css";
import useTranslation from "@/hooks/useTranslation";
import TomatePizzaAd from "@/components/ads/TomatePizza";
import OrangeSunStudio from "@/components/ads/gastronomy/OrangeSunStudio";
import Seo from "@/components/Seo";


export default function AnnouncementsPage() {
  const t = useTranslation();

  const [announcementGroups] = useState([
    {
      id: 1,
      type: "single",
      components: [<OrangeSunStudio key="legal" />],
    },
    {
      id: 2,
      type: "single",
      components: [<TomatePizzaAd key="legal" />],
    },
  ]);

  return (
    <>
      <Seo
        title={t("meta.ads_food_title")}
        description={t("meta.ads_food_description")}
      />

      <div className={styles.container}>
        <h3 className={styles.title}>{t("menu.ads_food")}</h3>

        <div className={styles.announcementsWrapper}>
          {announcementGroups.map((group) => (
            <div
              key={group.id}
              className={`${styles.announcementGroup} ${styles[group.type]}`}
            >
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