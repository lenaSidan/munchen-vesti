import Seo from "@/components/Seo";
import SocialLinksUseful from "@/components/SocialLinksUseful";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/UsefulPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { GetStaticProps } from "next";
import { getUsefulByLocale, UsefulItem } from "@/lib/getUseful";

interface UsefulListProps {
  items: UsefulItem[];
}

export default function UsefulPage({ items }: UsefulListProps) {
  const t = useTranslation();
  const { locale } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    { value: "", label: t("useful.all_categories") },
    { value: "health", label: t("useful.category.health") },
    { value: "family", label: t("useful.category.family") },
    { value: "work", label: t("useful.category.work") },
    { value: "housing", label: t("useful.category.housing") },
    { value: "travel", label: t("useful.category.travel") },
  ];

  const filteredItems = selectedCategory
    ? items.filter((it) => it.category?.includes(selectedCategory))
    : items;

  const heroHeading = t("useful.authorBlock.heading");
  const heroName = t("useful.authorBlock.authorName");
  const heroRole = t("useful.authorBlock.authorRole");
  const heroBio = t("useful.authorBlock.bio");
  const heroImage = t("useful.authorBlock.heroImage");

  return (
    <>
      <Seo title={t("meta.useful_title")} description={t("meta.useful_description")} />
      <h1 className={styles.visuallyHidden}>{t("useful.title")}</h1>

      <div className={styles.container}>
        <section className={styles.hero}>
          <h2 className={styles.title}>{t("useful.title")}</h2>

          {heroImage && (
            <div className={styles.heroImageWrap}>
              <Image
                src={heroImage}
                alt={heroHeading}
                width={450}
                height={600}
                className={styles.heroImage}
                priority
              />
            </div>
          )}

          <div className={styles.heroInfo}>
            <div className={styles.authorHeading}>{heroHeading}</div>
            <div className={styles.authorName}>
              {heroName} — {heroRole}
            </div>
            <p className={styles.authorBio}>{heroBio}</p>
            <div className={styles.socialLinks}>
              <SocialLinksUseful />
            </div>
          </div>
        </section>

        {/* <div className={styles.questionsTitle}>{t("useful.questionsTitle")}</div> */}

        <div className={styles.filterBox}>
          <label htmlFor="categoryFilter" className={styles.filterLabel}>
            {t("useful.filter_by_category")}
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.grid}>
          {filteredItems.map((it) => (
            <div key={it.slug} className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.content}>
                  <h3 className={styles.contentTitle}>{it.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: it.summaryHtml }} />
                </div>
                <Link href={`/useful/${it.slug}`} className={styles.readMoreLink}>
                  <button type="button" className={styles.readMore}>
                    {t("useful.read_more")} ➡
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.subscribeContainer}>
        <SubscribeBox />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<UsefulListProps> = async ({ locale }) => {
  const items = await getUsefulByLocale(locale || "ru");

  return {
    props: { items },
    revalidate: 600,
  };
};
           