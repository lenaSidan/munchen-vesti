import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/MiniPostcardsMobile.module.css";
import Image from "next/image";
import Link from "next/link";

// 🎴 Все возможные открытки
const postcards = [
  "/postcards/thumb/hofbrauhaus.webp?v=5",
  "/postcards/thumb/ostpolitik_brandt.webp?v=5",
  "/postcards/thumb/munich_secession.webp?v=4",
  "/postcards/thumb/russian_colony_munich.webp?v=1",
  "/postcards/thumb/russischer_muenchen_exil.webp?v=1",
  "/postcards/thumb/kandinsky_munich.webp?v=2",
  "/postcards/thumb/schaefflertanz_munich.webp?v=1",
  "/postcards/thumb/illuminaten.webp?v=1",
  "/postcards/thumb/schmorell.webp?v=1",
];

// 🖼️ Возвращает одну случайную открытку
function getRandomPostcard(): string {
  const randomIndex = Math.floor(Math.random() * postcards.length);
  return postcards[randomIndex];
}

export default function MiniPostcards() {
  const t = useTranslation();

  // 👇 выбираем только одну открытку
  const selectedPostcard = getRandomPostcard();

  return (
    <aside className={styles.announcements}>
       <div className={styles.decorativeLine}></div>
      <div className={styles.announcementHeader}>
        <h3 className={styles.announcementTitle}>{t("postcards.indexTitle")}</h3>
      </div>

      <Link href="/postcards-page" className={styles.wrapper}>
        <div className={styles.card}>
          <Image
            src={selectedPostcard}
            alt="Mini postcard"
            width={320}
            height={200}
            className={styles.image}
            loading="lazy"
          />
        </div>
      </Link>

      <div className={styles.decorativeLine}></div>
    </aside>
  );
}
