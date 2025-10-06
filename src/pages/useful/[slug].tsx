import PageHead from "@/components/PageHead";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/UsefulList.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import fs from "fs";
import { getUsefulBySlug, FullUsefulItem } from "@/lib/getUsefulBySlug";

interface FaqProps {
  faq: FullUsefulItem;
  locale: string;
}

function firstParagraphFromHtml(html: string): string {
  const m = html.match(/<p>(.*?)<\/p>/i);
  return m ? m[1] : "";
}

export default function UsefulArticle({ faq }: FaqProps) {
  const t = useTranslation();
  const { locale } = useRouter();
  const fullUrl = `https://munchen-vesti.de/${locale}/useful/${faq.slug}`;
  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}useful/${faq.slug}`;

  const shortAnswer = faq.summary || firstParagraphFromHtml(faq.content) || faq.seoDescription || "";

  // JSON-LD QAPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": faq.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": shortAnswer
      }
    }
  };

  return (
    <>
      <PageHead
        title={(faq.seoTitle || faq.title) + " – " + t("meta.default_title")}
        description={faq.seoDescription || t("meta.default_description")}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className={styles.container}>
        <div className={styles.headerBox}>
          <h2 className={styles.title}>{faq.title}</h2>
        </div>

        <div className={styles.columnsWithImage}>
          {faq.image && (
            <Image
              src={faq.image}
              alt={faq.imageAlt || faq.title}
              width={600}
              height={400}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
            />
          )}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: faq.content }}
          />
        </div>

        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/useful-page" className={styles.readMore}>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), "public/useful");
  const files = fs.readdirSync(dir);

  const paths = files
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const [slug, locale] = file.replace(".md", "").split(".");
      return { params: { slug }, locale };
    });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<FaqProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const faq = await getUsefulBySlug(params.slug as string, locale);
  if (!faq) return { notFound: true };

  return {
    props: { faq, locale },
    revalidate: 600,
  };
};
