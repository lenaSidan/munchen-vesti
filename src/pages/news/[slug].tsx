import PageHead from "@/components/PageHead";
import SocialLinks from "@/components/SocialLinks";
import useTranslation from "@/hooks/useTranslation";
import { getNewsJsonLd } from "@/lib/jsonld/getNewsJsonLd";
import { getNewsBySlug, FullNewsItem } from "@/lib/getNewsBySlug";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import fs from "fs";
import styles from "@/styles/NewsPage.module.css";

interface NewsProps {
  news: FullNewsItem;
  locale: string;
}

export default function NewsPage({ news, locale }: NewsProps) {
  const t = useTranslation();

  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}news/${news.slug}`;
  const jsonLd = getNewsJsonLd({
    title: news.title,
    description: news.seoDescription,
    url: canonicalUrl,
    image: news.image,
    datePublished: news.date,
  });

  return (
    <>
      <PageHead
        title={(news.seoTitle || news.title) + " – " + t("meta.default_title")}
        description={news.seoDescription || t("meta.default_description")}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className={styles.container}>
        <div className={styles.headerBox}>
          <h2 className={styles.title}>{news.title}</h2>
          {news.date && (
            <p className={styles.date}>
              {new Date(news.date).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className={styles.columnsWithImage}>
          {news.image && (
            <Image
              src={news.image}
              alt={news.imageAlt || news.title}
              className={styles.image}
              width={600}
              height={400}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          )}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/news-page" className={styles.readMore}>
            {t("articles.back")}
          </Link>
          <div className={`${styles.decorativeLine} ${styles.bottom}`}>
            <span className={styles.right}>⊱❧</span>
            <span className={styles.left}>⊱❧</span>
          </div>
        </div>
      </div>

      <div className={styles.socialLinks}>
        <SocialLinks />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const newsDir = path.join(process.cwd(), "public/news");
  const files = fs.readdirSync(newsDir);

  const paths = files
    .map((f) => f.replace(/\.(ru|de)\.md$/, ""))
    .filter((slug, i, self) => self.indexOf(slug) === i)
    .flatMap((slug) => [
      { params: { slug }, locale: "ru" },
      { params: { slug }, locale: "de" },
    ]);

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<NewsProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const news = await getNewsBySlug(params.slug as string, locale);
  if (!news) return { notFound: true };

  return {
    props: { news, locale },
    revalidate: 600,
  };
};
