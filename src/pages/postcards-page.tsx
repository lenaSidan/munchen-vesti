import Seo from "@/components/Seo";
import SocialLinks from "@/components/SocialLinks";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/PostcardsPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next";
import { getPostcardsByLocale, Postcard } from "@/lib/getPostcards";

interface PostcardsPageProps {
  postcards: Postcard[];
}

export default function PostcardsPage({ postcards }: PostcardsPageProps) {
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.postcards_title")} description={t("meta.postcards_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.postcardsAll_title")}</h1>

      <div className={styles.container}>
        <h2 className={styles.title}>{t("postcards.title")}</h2>

        <div className={styles.intro}>
          <p className={styles.subtitle}>{t("postcards.subtitle")}</p>
          <p className={styles.descriptionText}>{t("postcards.description")}</p>
        </div>

        <div className={styles.socialLinks}>
          <SocialLinks />
        </div>

        <div className={styles.grid}>
          {postcards.map((postcard) => (
            <Link key={postcard.slug} href={`/postcards/${postcard.slug}`} className={styles.card}>
              <Image
                src={postcard.image}
                alt={postcard.title}
                width={550}
                height={334}
                className={styles.image}
              />
              <div className={styles.cardTitle}>{postcard.title}</div>
            </Link>
          ))}
        </div>

        <SubscribeBox />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostcardsPageProps> = async ({ locale }) => {
  const postcards = getPostcardsByLocale(locale || "ru");

  return {
    props: { postcards },
    revalidate: 600,
  };
};
