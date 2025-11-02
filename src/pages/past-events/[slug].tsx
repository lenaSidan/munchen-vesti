import PageHead from "@/components/PageHead";
import useTranslation from "@/hooks/useTranslation";
import { getPastEventsByLocale } from "@/lib/getEvents";
import { renderMarkdownLinks } from "@/lib/renderMarkdownLinks";
import styles from "@/styles/Event.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface Event {
  fileId: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  date?: string;
  endDate?: string;
  time?: string;
  ort?: string;
  link?: string;
  image?: string;
  imageAlt?: string;
  content: string;
}

export default function PastEvent({ event }: { event: Event }) {
  const t = useTranslation();
  const canonicalUrl = `https://munchen-vesti.de/${t("lang") === "de" ? "de" : "ru"}/past-events/${event.fileId}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    endDate: event.endDate || event.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventEnded",
    location: {
      "@type": "Place",
      name: event.ort || "München",
    },
    image: event.image ? [`https://munchen-vesti.de${event.image}`] : [],
    description: event.seoDescription || "",
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
        <link
          rel="canonical"
          href={`https://munchen-vesti.de/${t("lang") === "de" ? "de" : "ru"}/past-events/${event.fileId}`}
        />
      </Head>

      <PageHead
        title={(event.seoTitle || event.title) + " – " + t("meta.default_title")}
        description={event.seoDescription || t("meta.default_description")}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className={styles.articleContainer}>
        <h2 className={styles.title}>{event.title}</h2>

        {/* Добавляем предупреждение для архивных событий */}
        <div className={styles.archivedNotice}>⚠️ {t("events.archived_notice")}</div>

        <div className={styles.meta}>
          {event.time}
          {event.ort && <span className={styles.ort}>{renderMarkdownLinks(event.ort)}</span>}
        </div>

        {event.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={event.image}
              alt={event.imageAlt || event.title}
              width={600}
              height={400}
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: event.content }} />

        <div className={styles.readMoreContainer}>
          <Link href="/past-events-page" className={styles.readMore}>
            ⬅ {t("articles.back")}
          </Link>
        </div>
      </div>
    </>
  );
}

/* ---------------------- STATIC GENERATION ---------------------- */

export const getStaticPaths: GetStaticPaths = async () => {
  const ruEvents = getPastEventsByLocale("ru");
  const deEvents = getPastEventsByLocale("de");

  const makePaths = (events: Event[], locale: string) =>
    events.map((event) => ({
      params: { slug: event.fileId },
      locale,
    }));

  const paths = [...makePaths(ruEvents, "ru"), ...makePaths(deEvents, "de")];
  return { paths, fallback: "blocking" };
};

export const getStaticProps = async ({ params, locale }: GetStaticPropsContext) => {
  if (!params?.slug || !locale) return { notFound: true };

  const slugParam = String(params.slug).toLowerCase();
  const archiveDir = path.join(process.cwd(), "public/events/arhiv");

  const files = fs.existsSync(archiveDir) ? fs.readdirSync(archiveDir) : [];
  const fileMatch = files.find(
    (filename) => filename.replace(`.${locale}.md`, "").toLowerCase() === slugParam
  );

  if (!fileMatch) return { notFound: true };

  const filePath = path.join(archiveDir, fileMatch);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    props: {
      event: {
        fileId: slugParam,
        title: data.title || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        date: data.date || "",
        endDate: data.endDate || "",
        time: data.time || "",
        ort: data.ort || "",
        image: data.image || "",
        imageAlt: data.imageAlt || "",
        content: contentHtml,
      },
      locale,
      archived: true,
    },
    revalidate: 43200,
  };
};
