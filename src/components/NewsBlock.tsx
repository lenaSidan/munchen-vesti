import Link from "next/link";
// import Image from "next/image";
import { NewsItem } from "@/lib/getNewsByLocale";
import styles from "@/styles/NewsBlock.module.css";
import useTranslation from "@/hooks/useTranslation";

interface Props {
  newsList: NewsItem[];
}

export default function NewsBlock({ newsList }: Props) {
  const t = useTranslation();

  return (
    <div className={styles.block}>
      {newsList.map((news) => (
        <div key={news.slug} className={styles.card}>
          {/* {news.image && (
            <Image
              src={news.image}
              alt={news.imageAlt || news.title}
              width={300}
              height={100}
              className={styles.image}
            />
          )} */}
          <div className={styles.content}>
            <h3>{news.title}</h3>
            {news.date && <p className={styles.date}>{new Date(news.date).toLocaleDateString()}</p>}
            <p dangerouslySetInnerHTML={{ __html: news.excerpt || "" }} />
            <Link href={`/news/${news.slug}`}>
              <button type="button" className={styles.readMore}>{t("read_more")}</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
