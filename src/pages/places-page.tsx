import Seo from "@/components/Seo";
import SocialLinks from "@/components/SocialLinks";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/PlacesPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface PlacesItem {
  slug: string;
  title: string;
  description: string;
  image: string;
}

export default function Places() {
  const t = useTranslation();
  const { locale } = useRouter();
  const placesItems: PlacesItem[] = [
    {
      slug: "essen-gehen",
      title: t("leisure.items.essen-gehen.title"),
      description: t("leisure.items.essen-gehen.description"),
      image: "/leisure_images/essen.png",
    },
    {
      slug: "mit-kindern",
      title: t("leisure.items.mit-kindern.title"),
      description: t("leisure.items.mit-kindern.description"),
      image: "/leisure_images/kids_logo.png",
    },
    {
      slug: "entdeckungen",
      title: t("leisure.items.entdeckungen.title"),
      description: t("leisure.items.entdeckungen.description"),
      image: "/leisure_images/discover.png",
    },
    // {
    //   slug: "freizeit-erlebnisse",
    //   title: t("leisure.items.freizeit-erlebnisse.title"),
    //   description: t("leisure.items.freizeit-erlebnisse.description"),
    //   image: "/leisure_images/fun_logo.png",
    // },
    {
      slug: "sehenswerte-orte",
      title: t("leisure.items.sehenswerte-orte.title"),
      description: t("leisure.items.sehenswerte-orte.description"),
      image: "/leisure_images/places.png",
    },
    // {
    //   slug: "stadt-routen",
    //   title: t("leisure.items.stadt-routen.title"),
    //   description: t("leisure.items.stadt-routen.description"),
    //   image: "/leisure_images/routes.png",
    // },
  ];

  return (
    <>
      <Seo title={t("meta.leisure_title")} description={t("meta.leisure_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.leisure_title")}</h1>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("leisure.title")}</h2>
        <div className={styles.introBox}>
          <p className={styles.intro1}>{t("leisure.intro1")}</p>
          <p className={styles.intro2}>{t("leisure.intro2")}</p>
          <p className={styles.intro2}>{t("leisure.p2")}</p>
          <p className={styles.intro3}>{t("leisure.intro3")}</p>
          <p className={styles.intro4}>{t("leisure.p3")}</p>
          <p className={styles.intro4}>{t("leisure.p4")}</p>
          <p className={styles.intro5}>
            <Link
              className={styles.intro6}
              href="https://munchen-vesti.de/contacts"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("leisure.contact_link")}
            </Link>
            .
          </p>
        </div>
         <div className={styles.socialLinks}>
          <SocialLinks />
        </div>
        <div className={styles.grid}>
          {placesItems.map((item) => (
            <Link key={item.slug} href={`/places/${item.slug}`} className={styles.card}>
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
