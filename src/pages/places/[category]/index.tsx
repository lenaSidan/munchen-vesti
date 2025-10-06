import PageHead from "@/components/PageHead";
import useTranslation from "@/hooks/useTranslation";
import { getPlacesByCategory } from "@/lib/getPlacesByCategory";
import styles from "@/styles/List.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";

interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  image?: string;
}

interface CategoryPageProps {
  category: string;
  articles: ArticleMeta[];
}

export default function CategoryPage({ category, articles }: CategoryPageProps) {
  const t = useTranslation();

  return (
    <>
      <PageHead
        title={`${t(`leisure.items.${category}.title`)} – ${t("meta.default_title")}`}
        description={t(`leisure.items.${category}.description`)}
        url={`https://munchen-vesti.de/places/${category}/list`}
      />

      <div className={styles.container}>
        <h2 className={styles.title}>{t(`leisure.items.${category}.title`)}</h2>

        <div className={styles.cardGrid}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/places/${category}/${article.slug}`}
              className={styles.card}
            >
              {article.image && (
                <Image
                  src={article.image}
                  alt={article.title}
                  width={140}
                  height={100}
                  className={styles.cardImage}
                />
              )}
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <div className={styles.cardDescription}>{article.description}</div>
                <div className={styles.cardMore}>{t("articles.read_more")} →</div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/places-page" className={styles.back}>
            {t("articles.back")}
          </Link>
          <div className={`${styles.decorativeLine} ${styles.bottom}`}>
            <span className={styles.right}>⊱❧</span>
            <span className={styles.left}>⊱❧</span>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const categoriesDir = path.join(process.cwd(), "public/places");
  const categories = fs.readdirSync(categoriesDir);

  const paths = [];

  for (const locale of locales || []) {
    for (const category of categories) {
      paths.push({
        params: { category },
        locale,
      });
    }
  }

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params, locale }) => {
  if (!params?.category || !locale) return { notFound: true };

  const category = params.category as string;
  const dir = path.join(process.cwd(), "public/places", category);
  if (!fs.existsSync(dir)) return { notFound: true };

const articles = getPlacesByCategory(category, locale);

  return {
    props: {
      category,
      articles,
    },
  };
};
