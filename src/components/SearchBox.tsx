import styles from "@/styles/SearchBox.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type SearchItem = {
  title: string;
  slug: string | string[];
  fileId: string;
  url: string;
};
interface SearchBoxProps {
  onClose?: () => void; // ← добавляем сюда
}
export default function SearchBox({ onClose }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [allItems, setAllItems] = useState<SearchItem[]>([]);

  // 🔹 Загружаем данные
  useEffect(() => {
    async function loadData() {
      try {
        const locale = router.locale || "ru";
        const res = await fetch(`/api/search-data?locale=${locale}`);
        const data = await res.json();
        setAllItems(data);
      } catch (err) {
        console.error("Ошибка загрузки данных для поиска:", err);
      }
    }
    loadData();
  }, [router.locale]);

  // 🔹 Фильтрация
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allItems.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const slugMatch = Array.isArray(item.slug)
        ? item.slug.some((s) => s.toLowerCase().includes(q))
        : item.slug.toLowerCase().includes(q);
      const fileMatch = item.fileId.toLowerCase().includes(q);
      return titleMatch || slugMatch || fileMatch;
    });

    setResults(filtered);
  }, [query, allItems]);

  // 🔹 Переход по клику
function handleResultClick(e: React.MouseEvent, item: SearchItem) {
  e.preventDefault();

  const locale = router.locale || "ru";
  const fullUrl = `/${locale}/events-page#${encodeURIComponent(item.fileId)}`;

  // hash меняется → сработает наш listener на странице событий
  router.push(fullUrl, undefined, { shallow: true });

  // UX: чистим и закрываем
  setQuery("");
  setResults([]);
  onClose?.();
}



  return (
    <div className={styles.searchBox}>
      <input
        type="text"
        placeholder={router.locale === "de" ? "Suche..." : "Поиск..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />

      {results.length > 0 && (
        <ul className={styles.results}>
          {results.map((item) => (
            <li key={item.fileId}>
              <a
                href={item.url}
                onClick={(e) => handleResultClick(e, item)}
                className={styles.link}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
