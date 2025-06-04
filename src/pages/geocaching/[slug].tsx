import LikeButton from "@/components/LikeButton";
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

interface PageMeta {
  slug: string;
  title: string;
  description: string;
  image?: string;
}

interface GeocachingPageProps {
  slug: string;
  title: string;
  image?: string;
  imageAlt?: string;
  content: string;
  otherPages: PageMeta[];
}

export default function GeocachingPage({
  slug,
  title,
  image,
  imageAlt,
  content,
  otherPages,
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

        <div className={styles.likeContainer}>
          <LikeButton slug={slug} />
        </div>

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

        {otherPages.length > 0 && (
          <>
            <div className={styles.titleOther}>{t("geocaching.more_geocaching")}</div>
            <div className={styles.cardGrid}>
              {otherPages.map((page) => (
                <Link key={page.slug} href={`/geocaching/${page.slug}`} className={styles.card}>
                  {page.image && (
                    <Image
                      src={page.image}
                      alt={page.title}
                      width={70}
                      height={70}
                      className={styles.cardImage}
                    />
                  )}
                  <div className={styles.cardText}>
                    <div className={styles.cardTitle}>{page.title}</div>
                    <div className={styles.cardDescription}>{page.description}</div>
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

  const paths = files.map((file) => {
    const [slug, locale] = file.replace(".md", "").split(".");
    return { params: { slug }, locale };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<GeocachingPageProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) return { notFound: true };

  const currentSlug = params.slug as string;
  const currentFilePath = path.join(
    process.cwd(),
    "public/geocaching",
    `${currentSlug}.${locale}.md`
  );

  if (!fs.existsSync(currentFilePath)) return { notFound: true };

  const fileContent = fs.readFileSync(currentFilePath, "utf8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);

  // список всех карточек
  const allPages: PageMeta[] = [
    {
      slug: "sightseeing-caches",
      title:
        locale === "de" ? "Tarnungen bei Sehenswürdigkeiten" : "Тайники у достопримечательностей",
      description: locale === "de" ? "Erforschen Sie München neu." : "Исследуйте Мюнхен по-новому.",
      image: "/geocaching_images/sightseeing.webp",
    },
    {
      slug: "night-adventures",
      title: locale === "de" ? "Nächtliche Abenteuer (N8@MUC)" : "Ночные приключения (N8@MUC)",
      description:
        locale === "de"
          ? "Wenn die Stadt schläft, erwachen unsere Caches zum Leben."
          : "Фонарик, темнота, и вы — как в квесте. ",
      image: "/geocaching_images/night.webp",
    },
    {
      slug: "hiking-caches",
      title: locale === "de" ? "Wander-Caches" : "Прогулки и походы",
      description:
        locale === "de"
          ? "Geocaching entlang von Waldwegen und Flüssen."
          : "Тайники на выходных: леса, тропы, поля, реки.",
      image: "/geocaching_images/hiking.webp",
    },
    {
      slug: "creative-hides",
      title: locale === "de" ? "Kreative Verstecke" : "Самые необычные тайники",
      description:
        locale === "de"
          ? "Verblüffende Orte und Rätsel – für erfahrene Geocacher."
          : "Тайники, которые удивят даже профи.",
      image: "/geocaching_images/highlights.webp",
    },
    {
      slug: "family-caching",
      title: locale === "de" ? "Familiencaching" : "Для детей и всей семьи",
      description:
        locale === "de"
          ? "Einfache Caches für den ersten Einstieg mit Kindern."
          : "Добрые, весёлые задания и первая карта.",
      image: "/geocaching_images/family.webp",
    },
    {
      slug: "paranoia-at-night",
      title: "Paranoia@Night",
      description:
        locale === "de"
          ? "Legendärer Einzelspieler-Cache mit düsterer Atmosphäre."
          : "Мрачная легенда для тех, кто не боится одиночества.",
      image: "/geocaching_images/paranoia.png",
    },
  ];

  const otherPages = allPages.filter((page) => page.slug !== currentSlug);

  return {
    props: {
      slug: currentSlug,
      title: data.title || "",
      image: data.image || "",
      imageAlt: data.imageAlt || "",
      content: processedContent.toString(),
      otherPages,
    },
  };
};
