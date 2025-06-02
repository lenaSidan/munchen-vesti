
import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/GeocachingPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface GeocacheItem {
  slug: string;
  title: string;
  description: string;
  image: string;
}

export default function Geocaching() {
  const t = useTranslation();
  const { locale } = useRouter();
  const geocacheItems: GeocacheItem[] = [
    {
      slug: "sightseeing-caches",
      title: t("geocaching.items.sightseeing-caches.title"),
      description: t("geocaching.items.sightseeing-caches.description"),
      image: "/geocaching/sightseeing.png",
    },
    {
      slug: "night-adventures",
      title: t("geocaching.items.night-adventures.title"),
      description: t("geocaching.items.night-adventures.description"),
      image: "/geocaching/night.png",
    },
    {
      slug: "hiking-caches",
      title: t("geocaching.items.hiking-caches.title"),
      description: t("geocaching.items.hiking-caches.description"),
      image: "/geocaching/hiking.png",
    },
    {
      slug: "creative-hides",
      title: t("geocaching.items.creative-hides.title"),
      description: t("geocaching.items.creative-hides.description"),
      image: "/geocaching/highlights.png",
    },
    {
      slug: "family-caching",
      title: t("geocaching.items.family-caching.title"),
      description: t("geocaching.items.family-caching.description"),
      image: "/geocaching/family.png",
    },
    {
      slug: "paranoia-at-night",
      title: t("geocaching.items.paranoia-at-night.title"),
      description: t("geocaching.items.paranoia-at-night.description"),
      image: "/geocaching/paranoia.png",
    },
  ];

  return (
    <>
      <Seo title={t("meta.geocaching_title")} description={t("meta.geocaching_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.geocaching_title")}</h1>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("geocaching.title")}</h2>
        <div className={styles.introBox}>
          <p className={styles.intro1}>{t("geocaching.intro1")}</p>
          <p className={styles.intro2}>{t("geocaching.intro2")}</p>
          <p className={styles.intro3}>{t("geocaching.intro3")}</p>
        </div>
        <div className={styles.grid}>
          {geocacheItems.map((item) => (
            <Link key={item.slug} href={`/geocaching/${item.slug}`} className={styles.card}>
              <Image
                src={item.image}
                alt={item.title}
                width={150}
                height={150}
                className={styles.image}
              />
              <div className={styles.cardText}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <SubscribeBox />
      </div>
    </>
  );
}
