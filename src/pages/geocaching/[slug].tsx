import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import PageHead from "@/components/PageHead";
import styles from "@/styles/Geocaching.module.css";
import { getGeocacheBySlug, GeocachePage } from "@/lib/getGeocacheBySlug";

interface GeocachingPageProps {
  page: GeocachePage;
  locale: string;
}

export default function GeocachingPage({ page, locale }: GeocachingPageProps) {
  const t = useTranslation();

  return (
    <>
      <PageHead
        title={`${page.title} – ${t("meta.default_title")}`}
        description={t("meta.default_description")}
        url={`https://munchen-vesti.de/${locale}/geocaching/${page.slug}`}
      />

      <div className={styles.container}>
        <h2 className={styles.title}>{page.title}</h2>

        <div
          className={`${styles.content} ${styles.geocaching}`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {page.image && (
          <Image
            src={page.image}
            alt={page.imageAlt || page.title}
            className={styles.image}
            width={200}
            height={200}
          />
        )}

        <div className={styles.backContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/geocaching-page" className={styles.back}>
            {t("articles.back")}
          </Link>
          <div className={`${styles.decorativeLine} ${styles.bottom}`}>
            <span className={styles.right}>⊱❧</span>
            <span className={styles.left}>⊱❧</span>
          </div>
        </div>

        {page.otherPages.length > 0 && (
          <>
            <div className={styles.titleOther}>{t("geocaching.more_geocaching")}</div>
            <div className={styles.cardGrid}>
              {page.otherPages.map((p) => (
                <Link key={p.slug} href={`/geocaching/${p.slug}`} className={styles.card}>
                  {p.image && (
                    <Image src={p.image} alt={p.title} width={70} height={70} className={styles.cardImage} />
                  )}
                  <div className={styles.cardText}>
                    <div className={styles.cardTitle}>{p.title}</div>
                    <div className={styles.cardDescription}>{p.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), "public/geocaching");
  const files = fs.readdirSync(dir);

  const paths = files
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const [slug, locale] = file.replace(".md", "").split(".");
      return { params: { slug }, locale };
    });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<GeocachingPageProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const page = await getGeocacheBySlug(params.slug as string, locale);
  if (!page) return { notFound: true };

  return {
    props: { page, locale },
    revalidate: 600,
  };
};
