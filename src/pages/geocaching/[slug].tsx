import PageHead from "@/components/PageHead";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Geocaching.module.css";
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


interface GeocachingPageProps {
  slug: string;
  title: string;
  image?: string;
  imageAlt?: string;
  content: string;
}

export default function GeocachingPage({
  slug,
  title,
  image,
  imageAlt,
  content,
}: GeocachingPageProps) {
  const t = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <PageHead
        title={`${title} – ${t("meta.default_title")}`}
        description={t("meta.default_description")}
        url={`https://munchen-vesti.de/${locale}/geocaching/${slug}`}
      />

      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>

        <div
          className={`${styles.content} ${styles.geocaching}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {image && (
          <Image
            src={image}
            alt={imageAlt || title}
            className={styles.image}
            width={200}
            height={200}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        )}

        {/* <div className={styles.likeContainer}>
          <LikeButton slug={slug} />
        </div> */}
        <div className={styles.backContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href={"/geocaching-page"} className={styles.back}>
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
  const dir = path.join(process.cwd(), "public/geocaching");
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

export const getStaticProps: GetStaticProps<GeocachingPageProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const filePath = path.join(process.cwd(), "public/geocaching", `${params.slug}.${locale}.md`);
  if (!fs.existsSync(filePath)) return { notFound: true };

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true }) // обязательно
    .use(rehypeRaw) // вот эта строка нужна!
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);

  return {
    props: {
      slug: params.slug as string,
      title: data.title || "",
      image: data.image || "",
      imageAlt: data.imageAlt || "",
      content: processedContent.toString(),
    },
  };
};
