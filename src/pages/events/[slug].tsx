import LikeButton from "@/components/LikeButton";
import PageHead from "@/components/PageHead";
import SocialLinks from "@/components/SocialLinks";
import useTranslation from "@/hooks/useTranslation";
import { getEventsByLocale } from "@/lib/getEvents";
import { getEventJsonLd } from "@/lib/jsonld/eventJsonLd";
import styles from "@/styles/Event.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface Event {
  slug: string;
  title: string;
  date?: string;
  endDate?: string;
  time?: string;
  ort?: string;
  link?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface EventProps {
  event: Event;
  locale: string;
  archived: boolean;
}

export default function Event({ event, locale, archived }: EventProps) {
  const t = useTranslation();

  const canonicalUrl = `https://munchen-vesti.de/${locale === "de" ? "de/" : "ru/"}events/${event.slug}`;

  const jsonLd = getEventJsonLd({
    title: event.title,
    description: event.seoDescription || "",
    date: event.date || "",
    endDate: event.endDate,
    time: event.time || "",
    image: event.image || "/default-og-image.png",
    ort: event.ort || "München",
  });

  return (
    <>
      <PageHead
        title={(event.seoTitle || event.title) + " – " + t("meta.default_title")}
        description={event.seoDescription || t("meta.default_description")}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />
      {archived && <meta name="robots" content="noindex, nofollow" />}
      <div className={styles.articleContainer}>
        <h2 className={styles.title}>{event.title}</h2>
        <p className={styles.meta}>
          {event.date}
          {event.endDate && ` – ${event.endDate}`}
          {event.ort && ` | ${event.ort}`}
        </p>
        {archived && <div className={styles.archivedNotice}>⚠️ {t("events.archived_notice")}</div>}
        {event.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={event.image}
              alt={event.imageAlt || event.title}
              width={600}
              height={400}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: event.content }} />
        <div className={styles.likeContainer}>
          <LikeButton slug={event.slug} />
        </div>
        <div className={styles.readMoreContainer}>
          <div className={styles.decorativeLine}>
            <span className={styles.left}>⊱❧</span>
            <span className={styles.right}>⊱❧</span>
          </div>
          <Link href="/events" className={styles.readMore}>
            {t("articles.back")}
          </Link>
          <div className={`${styles.decorativeLine} ${styles.bottom}`}>
            <span className={styles.right}>⊱❧</span>
            <span className={styles.left}>⊱❧</span>
          </div>
        </div>
      </div>
      <div  className={styles.socialLinks}>
        <SocialLinks />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ruEvents = getEventsByLocale("ru");
  const deEvents = getEventsByLocale("de");

  const paths = [
    ...ruEvents.map((event) => ({ params: { slug: event.slug }, locale: "ru" })),
    ...deEvents.map((event) => ({ params: { slug: event.slug }, locale: "de" })),
  ];

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<EventProps> = async ({ params, locale }) => {
  if (!params?.slug || !locale) {
    return { notFound: true };
  }

  const eventsDir = path.join(process.cwd(), "public/events");
  const archiveDir = path.join(eventsDir, "arhiv");

  const files = fs.readdirSync(eventsDir);
  const archivedFiles = fs.existsSync(archiveDir) ? fs.readdirSync(archiveDir) : [];
  const allFiles = [...files, ...archivedFiles];

  const matchingFile = allFiles.find((file) => file.endsWith(`-${params.slug}.${locale}.md`));

  if (!matchingFile) {
    return { notFound: true };
  }

  const filePath = files.includes(matchingFile)
    ? path.join(eventsDir, matchingFile)
    : path.join(archiveDir, matchingFile);

  const isArchived = !files.includes(matchingFile);

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      event: {
        slug: params.slug as string,
        title: data.title || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        date: data.date ? String(data.date) : "",
        endDate: data.endDate ? String(data.endDate) : "",
        time: data.time || "",
        ort: data.ort || "",
        link: data.link || "",
        image: data.image || "",
        imageAlt: data.imageAlt || "",
        content: contentHtml,
      },
      locale,
      archived: isArchived,
    },
    revalidate: 600,
  };
};
