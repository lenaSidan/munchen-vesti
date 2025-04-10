import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/NewsPage.module.css";
import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";

interface NewsItem {
  slug: string;
  title: string;
  date?: string;
  image?: string;
  imageAlt?: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  excerpt?: string;
}

interface NewsProps {
  news: NewsItem;
}

export default function NewsPage({ news }: NewsProps) {
  const t = useTranslation();
  const { locale } = useRouter();
  return (
    <>
      <Seo title={news.seoTitle || news.title} description={news.seoDescription} image={news.image} />
      <div className={styles.container}>
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
        {news.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={news.image}
              alt={news.imageAlt || news.title}
              width={700}
              height={400}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: news.content }} />
        <Link href="/" className={styles.backLink}>
          {t("articles.back")}
        </Link>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const newsDir = path.join(process.cwd(), "public/news");
  const files = fs.readdirSync(newsDir);

  const paths = files.map((file) => {
    const [slug, locale] = file.replace(".md", "").split(".");
    return { params: { slug }, locale };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<NewsProps> = async ({ params, locale }) => {
  if (!params?.slug) return { notFound: true };

  const filePath = path.join(process.cwd(), "public/news", `${params.slug}.${locale}.md`);
  if (!fs.existsSync(filePath)) return { notFound: true };

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(content);

  return {
    props: {
      news: {
        slug: params.slug as string,
        title: data.title || "",
        date: data.date ? new Date(data.date).toISOString() : "",
        image: data.image || "",
        imageAlt: data.imageAlt || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        content: processedContent.toString(),
      },
    },
  };
};
