import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import Image from "next/image";
import styles from "@/styles/Event.module.css";
import { getEventsByLocale } from "@/lib/getEvents";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";

interface Event {
  slug: string;
  title: string;
  date?: string;
  time?: string;
  ort?: string;
  link?: string;
  content: string;
  image?: string;
}

interface EventProps {
  event: Event;
}

export default function Event({ event }: EventProps) {
  const t = useTranslation();
  
  return (
    <div className={styles.articleContainer}>
      <h2 className={styles.title}>{event.title}</h2>
      <p className={styles.meta}>
        {event.date} {event.ort && `| ${event.ort}`}
      </p>
      {event.image && (
        <div className={styles.imageWrapper}>
          <Image src={event.image} alt={event.title} width={600} height={400} className={styles.image} />
        </div>
      )}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: event.content }} />
      <div className={styles.readMoreContainer}>
        <div className={styles.decorativeLine}>
          <span className={styles.left}>⊱❧</span>
          <span className={styles.right}>⊱❧</span>
        </div>

        <Link href="/" className={styles.readMore}>
          {t("articles.back")}
        </Link>

        <div className={`${styles.decorativeLine} ${styles.bottom}`}>
          <span className={styles.right}>⊱❧</span>
          <span className={styles.left}>⊱❧</span>
        </div>
      </div>
    </div>
    
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
  if (!params?.slug) {
    return { notFound: true };
  }

  const filePath = path.join(process.cwd(), "public/events", `${params.slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  // 🔹 Улучшенный рендеринг Markdown с поддержкой GitHub-форматирования
  const processedContent = await remark()
    .use(remarkGfm) // Поддержка Markdown-таблиц, чекбоксов, заголовков
    .use(remarkRehype) // Преобразование Markdown в HTML AST
    .use(rehypeStringify) // Преобразование AST в строку HTML
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    props: {
      event: {
        slug: params.slug as string,
        title: data.title || "Untitled",
        date: data.date || "Unknown date",
        time: data.time || "",
        ort: data.ort || "Unknown author", 
        link: data.link || "",
        image: data.image || null,
        content: contentHtml,
      },
    },
    revalidate: 600,
  };
};
