import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/MiniPostcards.module.css";
import Image from "next/image";
import Link from "next/link";

const postcards = [
  "/postcards/thumb/hofbrauhaus.webp?v=5",
  "/postcards/thumb/ostpolitik_brandt.webp?v=5",
  "/postcards/thumb/munich_secession.webp?v=4",
  "/postcards/thumb/russian_colony_munich.webp?v=1",
];

function getRandomPostcards(count: number) {
  const shuffled = postcards.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MiniPostcards() {
  const t = useTranslation();
  const selectedPostcards = getRandomPostcards(3);

  return (
    <aside className={styles.announcements}>
      <div className={styles.announcementHeader}>
        <h3 className={styles.announcementTitle}>{t("postcards.indexTitle")}</h3>
        <Link href="/postcards-page" className={styles.wrapper}>
          {selectedPostcards.map((src, index) => (
            <div key={index} className={styles.card}>
              <Image src={src} alt="Mini postcard" width={320} height={200} />
            </div>
          ))}
        </Link>
      </div>
      <div className={styles.decorativeLine}></div>
    </aside>
  );
}
