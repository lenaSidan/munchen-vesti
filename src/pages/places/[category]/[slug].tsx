import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import PageHead from "@/components/PageHead";
import styles from "@/styles/Places.module.css";
import { getPlaceBySlug, PlaceArticle } from "@/lib/getPlaceBySlug";

interface PlacePageProps {
  article: PlaceArticle;
  locale: string;
}

export default function PlaceArticlePage({ article, locale }: PlacePageProps) {
  const t = useTranslation();

  return (
    <>
      <PageHead
        title={`${article.title} – ${t("meta.default_title")}`}
        description={t("meta.default_description")}
        url={`https://munchen-vesti.de/${locale}/places/${article.category}/${article.slug}`}
      />

      <div className={styles.container}>
        <h2 className={styles.title}>{article.title}</h2>

        {article.image && (
          <div className={styles.headerBox}>
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              width={600}
              height={342}
              className={styles.headerImage}
            />
          </div>
        )}

        <div
          className={`${styles.content} ${styles.places}`}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href={`/places/${article.category}`} className={styles.back}>
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
  const baseDir = path.join(process.cwd(), "public/places");
  const categories = fs.readdirSync(baseDir);
  const paths: { params: { category: string; slug: string }; locale: string }[] = [];

  for (const category of categories) {
    const dir = path.join(baseDir, category);
    if (!fs.statSync(dir).isDirectory()) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const [name, locale] = file.replace(".md", "").split(".");
      if (locales?.includes(locale)) {
        paths.push({ params: { category, slug: name }, locale });
      }
    }
  }

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<PlacePageProps> = async ({ params, locale }) => {
  if (!params?.category || !params?.slug || !locale) return { notFound: true };

  const article = await getPlaceBySlug(params.category as string, params.slug as string, locale);
  if (!article) return { notFound: true };

  return {
    props: { article, locale },
    revalidate: 600,
  };
};
