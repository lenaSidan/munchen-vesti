import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm"; // Поддержка Markdown-таблиц, чекбоксов и заголовков
import remarkRehype from "remark-rehype"; // Преобразование Markdown в HTML AST
import rehypeStringify from "rehype-stringify"; // Преобразование AST в строку HTML
import Image from "next/image";
import styles from "@/styles/Event.module.css";
import { getEventsByLocale } from "@/lib/getEvents";

interface Event {
  slug: string;
  title: string;
  date: string;
  author?: string;
  image?: string;
  content: string;
}

interface EventProps {
  event: Event;
}

export default function Event({ event }: EventProps) {
  return (
    <div className={styles.articleContainer}>
      <h2 className={styles.title}>{event.title}</h2>
      <p className={styles.meta}>
        {event.date} {event.author && `| ${event.author}`}
      </p>
      {event.image && (
        <div className={styles.imageWrapper}>
          <Image src={event.image} alt={event.title} width={600} height={400} className={styles.image} />
        </div>
      )}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: event.content }} />
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
        title: data.title || "Без названия",
        date: data.date || "Неизвестная дата",
        author: data.author || "",
        image: data.image || null,
        content: contentHtml,
      },
    },
    revalidate: 600,
  };
};
