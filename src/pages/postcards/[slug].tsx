import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import { getPostcardJsonLd } from "@/lib/jsonld/getPostcardJsonLd";
import styles from "@/styles/PostcardSingle.module.css";
import SocialLinks from "@/components/SocialLinks";
import { getPostcardBySlug, FullPostcard } from "@/lib/getPostcardBySlug";

interface PostcardProps {
  postcard: FullPostcard;
  locale: string;
}

export default function Postcard({ postcard, locale }: PostcardProps) {
  const t = useTranslation();

  const fullUrl = `https://munchen-vesti.de/${locale}/postcards/${postcard.slug}`;
  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}postcards/${postcard.slug}`;

  const jsonLd = getPostcardJsonLd({
    title: postcard.title,
    description: postcard.seoDescription,
    url: fullUrl,
    image: postcard.image,
  });

  return (
    <>
      <PageHead
        title={(postcard.seoTitle || postcard.title) + " – " + t("meta.default_title")}
        description={postcard.seoDescription || t("meta.default_description")}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className={styles.container}>
        <div className={styles.columnsWithImage}>
          <Image
            src={postcard.image}
            alt={postcard.title}
            width={600}
            height={375}
            className={styles.image}
          />
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: postcard.content }}
          />
        </div>

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/postcards-page" className={styles.readMore}>
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
  const dir = path.join(process.cwd(), "public/postcards-md");
  const files = fs.readdirSync(dir);

  const paths = files
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const [slug, locale] = file.replace(".md", "").split(".");
      return { params: { slug }, locale };
    });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<PostcardProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const postcard = await getPostcardBySlug(params.slug as string, locale);
  if (!postcard) return { notFound: true };

  return {
    props: { postcard, locale },
    revalidate: 600,
  };
};
