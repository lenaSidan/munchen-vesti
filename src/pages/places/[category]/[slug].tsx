import LikeButton from "@/components/LikeButton";
import PageHead from "@/components/PageHead";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Places.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface PageProps {
  category: string;
  slug: string;
  title: string;
  content: string;
  image?: string;
  imageAlt?: string;
}

export default function PlaceArticle({
  category,
  slug,
  title,
  content,
  image,
  imageAlt,
}: PageProps) {
  const t = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <PageHead
        title={`${title} – ${t("meta.default_title")}`}
        description={t("meta.default_description")}
        url={`https://munchen-vesti.de/${locale}/places/${category}/${slug}`}
      />

      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {image && (
          <div className={styles.headerBox}>
            <Image
              src={image}
              alt={imageAlt || title}
              width={600}
              height={342}
              className={styles.headerImage}
            />
          </div>
        )}

        <div
          className={`${styles.content} ${styles.places}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* <div className={styles.likeContainer}>
          <LikeButton slug={`${category}--${slug}`} />
        </div> */}
        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href={`/places/${category}`} className={styles.back}>
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
  const paths = [];

  for (const category of categories) {
    const dir = path.join(baseDir, category);
    if (!fs.statSync(dir).isDirectory()) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const nameParts = file.replace(".md", "").split(".");
      const fileLocale = nameParts.pop();
      const slug = nameParts.join(".");

      if (fileLocale && locales?.includes(fileLocale)) {
        paths.push({
          params: { category, slug },
          locale: fileLocale,
        });
      }
    }
  }

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { category, slug } = params || {};
  if (!category || !slug || !locale) return { notFound: true };

  const filePath = path.join(
    process.cwd(),
    "public/places",
    category as string,
    `${slug}.${locale}.md`
  );

  if (!fs.existsSync(filePath)) return { notFound: true };

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);

  return {
    props: {
      category,
      slug,
      title: data.title || slug,
      image: data.image || null,
      imageAlt: data.imageAlt || null,
      content: processedContent.toString(),
    },
  };
};
