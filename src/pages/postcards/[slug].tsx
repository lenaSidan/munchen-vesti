import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeExternalLinks from "rehype-external-links";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import { getPostcardJsonLd } from "@/lib/jsonld/getPostcardJsonLd";
import styles from "@/styles/PostcardSingle.module.css";

interface PostcardItem {
  slug: string;
  title: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  image: string;
}

interface PostcardProps {
  postcard: PostcardItem;
  locale: string;
}

// Функция генерации версии для картинки
function getImageWithVersion(imagePath: string) {
  const fullPath = path.join(process.cwd(), "public", imagePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const timestamp = stats.mtime.getTime();
    return `${imagePath}?v=${timestamp}`;
  }
  return imagePath;
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
          <div className={styles.text} dangerouslySetInnerHTML={{ __html: postcard.content }} />
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
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), "public/postcards-md");
  const files = fs.readdirSync(dir);

  const paths = files.map((file) => {
    const [slug, locale] = file.replace(".md", "").split(".");
    return { params: { slug }, locale };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostcardProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const filePath = path.join(process.cwd(), "public/postcards-md", `${params.slug}.${locale}.md`);
  if (!fs.existsSync(filePath)) return { notFound: true };

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);

  // Генерация версии для картинки
  const imagePath = `/postcards/full/${params.slug}.webp`;
  const versionedImage = getImageWithVersion(imagePath);

  return {
    props: {
      postcard: {
        slug: params.slug as string,
        title: data.title || params.slug,
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        content: processedContent.toString(),
        image: versionedImage,
      },
      locale,
    },
  };
};
