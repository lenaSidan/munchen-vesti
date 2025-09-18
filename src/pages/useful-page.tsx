import Seo from "@/components/Seo";
import SocialLinksUseful from "@/components/SocialLinksUseful";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/UsefulPage.module.css";

import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import { useState } from "react";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

type FaqItem = {
  slug: string;
  title: string;
  date?: string;
  image?: string;
  imageAlt?: string;
  summaryHtml: string;
  category?: string;
};

interface UsefulListProps {
  items: FaqItem[];
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

        <div className={styles.questionsTitle}>{t("useful.questionsTitle")}</div>

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

async function convertMarkdownToHtml(markdown: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return processed.toString();
}

export const getStaticProps: GetStaticProps<UsefulListProps> = async ({ locale }) => {
  const currentLocale = locale || "ru";
  const dir = path.join(process.cwd(), "public", "useful");

  if (!fs.existsSync(dir)) {
    return { props: { items: [] } };
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(`.${currentLocale}.md`));

  const items: FaqItem[] = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(dir, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      const slug = filename.replace(`.${currentLocale}.md`, "");
      const summarySrc = (data.summary || data.description || "").toString().trim();

      let summaryHtml = "";
      if (summarySrc) {
        summaryHtml = await convertMarkdownToHtml(summarySrc);
      } else {
        const firstParagraph =
          (content.split("\n").find((line) => line.trim()) || "").slice(0, 200) + "...";
        summaryHtml = await convertMarkdownToHtml(firstParagraph);
      }

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "",
        image: data.image || "",
        imageAlt: data.imageAlt || data.title || "",
        summaryHtml,
        category: data.category || "",
      };
    })
  );

  return { props: { items } };
};
