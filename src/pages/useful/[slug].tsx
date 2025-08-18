import PageHead from "@/components/PageHead";

import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/UsefulList.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface FaqItem {
  slug: string;
  title: string;
  date?: string;
  image?: string;
  imageAlt?: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
}

interface FaqProps {
  faq: FaqItem;
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
     
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: faq.content }} />
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

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<FaqProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const filePath = path.join(process.cwd(), "public/useful", `${params.slug}.${locale}.md`);
  if (!fs.existsSync(filePath)) return { notFound: true };

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);

  return {
    props: {
      faq: {
        slug: params.slug as string,
        title: data.title || "",
        date: data.date ? String(data.date) : "",
        image: data.image || "",
        imageAlt: data.imageAlt || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        summary: data.summary || "",
        content: processedContent.toString()
      },
      locale
    }
  };
};
