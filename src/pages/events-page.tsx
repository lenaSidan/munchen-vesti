import Seo from "@/components/Seo";
import SubscribeBox from "@/components/SubscribeBox";
import useTranslation from "@/hooks/useTranslation";
import { Event, getEventsByLocale } from "@/lib/getEvents";
import styles from "@/styles/EventsPageNew.module.css";
import type { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

// Расширенная типизация
type LiteEvent = Omit<Event, "content"> & { excerptHtml?: string };

interface EventsProps {
  events: LiteEvent[];
}

export default function EventsPage({ events }: EventsProps) {
  const t = useTranslation();
  const router = useRouter();

  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [eventContents, setEventContents] = useState<Record<string, string>>({});

  // 🔹 Загрузка полного текста события (API по прежнему принимает slug-СТРОКУ)
  async function loadContent(id: string) {
    if (eventContents[id]) return;
    const ev = events.find((e) => e.fileId === id || e.slug.includes(id));
    if (!ev) return;

    // Канонический параметр для API — первый slug
    const canonicalSlug = ev.slug[0];

    try {
      const res = await fetch(
        `/api/event/${encodeURIComponent(canonicalSlug)}?locale=${router.locale}`
      );
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setEventContents((prev) => ({ ...prev, [id]: data.content as string }));
    } catch (e) {
      console.error(e);
      setEventContents((prev) => ({ ...prev, [id]: "<p>Не удалось загрузить текст.</p>" }));
    }
  }

  // 🔹 Список доступных месяцев
  const monthYearOptions = useMemo(() => {
    const now = new Date();
    now.setDate(1);
    const set = new Set<string>();
    const list: { value: string; label: string }[] = [];

    events.forEach((ev) => {
      if (!ev.date) return;
      const start = new Date(ev.date);
      const end = ev.endDate ? new Date(ev.endDate) : start;

      const cur = new Date(start);
      cur.setDate(1);

      while (
        cur.getFullYear() < end.getFullYear() ||
        (cur.getFullYear() === end.getFullYear() && cur.getMonth() <= end.getMonth())
      ) {
        const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
        if (monthEnd < now) {
          cur.setMonth(cur.getMonth() + 1);
          continue;
        }
        const y = cur.getFullYear();
        const mIdx = cur.getMonth();
        const monthName = t(`months.${cur.toLocaleString("en", { month: "long" }).toLowerCase()}`);
        const value = `${y}-${String(mIdx + 1).padStart(2, "0")}`;
        if (!set.has(value)) {
          set.add(value);
          list.push({ value, label: `${monthName} ${y}` });
        }
        cur.setMonth(cur.getMonth() + 1);
      }
    });

    return list.sort((a, b) => a.value.localeCompare(b.value));
  }, [events, t]);

  // 🔹 Устанавливаем текущий месяц по умолчанию
  useEffect(() => {
    if (!selectedMonthYear && monthYearOptions.length > 0) {
      if (typeof window !== "undefined" && window.location.hash) return;
      const now = new Date();
      const cur = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      setSelectedMonthYear(
        monthYearOptions.find((o) => o.value === cur)?.value || monthYearOptions[0].value
      );
    }
  }, [monthYearOptions, selectedMonthYear]);

  // 🔹 Фильтрация событий по месяцу
  const filteredEvents = useMemo(() => {
    if (!selectedMonthYear) return [];
    const [y, m] = selectedMonthYear.split("-").map(Number);
    return events.filter((ev) => {
      if (!ev.date) return false;
      const s = new Date(ev.date);
      const e = ev.endDate ? new Date(ev.endDate) : s;
      const sM = s.getMonth() + 1,
        sY = s.getFullYear();
      const eM = e.getMonth() + 1,
        eY = e.getFullYear();
      const startsBeforeOrIn = sY < y || (sY === y && sM <= m);
      const endsAfterOrIn = eY > y || (eY === y && eM >= m);
      return startsBeforeOrIn && endsAfterOrIn;
    });
  }, [selectedMonthYear, events]);

  // 🔹 Обработка хэша в URL (fileId или любой из slug[])
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash || !events?.length) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const ev = events.find((e) => e.fileId === hash || e.slug.includes(hash));

    if (!ev?.date) return;
    const d = new Date(ev.date);
    const target = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (selectedMonthYear !== target) setSelectedMonthYear(target);
  }, [events]);

  // 🔹 Scroll и раскрытие нужной карточки по хэшу
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;
    const raw = window.location.hash.slice(1);
    const decoded = decodeURIComponent(raw);

    const id = requestAnimationFrame(() => {
      const match = events.find((e) => e.fileId === decoded || e.slug.includes(decoded));
      if (!match) return;
      const el = document.getElementById(match.fileId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setExpandedId(match.fileId);
        loadContent(match.fileId);
      }
    });

    return () => cancelAnimationFrame(id);
  }, [selectedMonthYear, filteredEvents]);

  // 🔹 Рендер ссылок в Markdown формате
  function renderMarkdownLinks(input: string, classNameLink?: string, classNameText?: string) {
    if (!input) return null;
    const md = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;
    const trimmed = input.trim();
    if (md.test(trimmed)) {
      const [, text, href] = trimmed.match(md)!;
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classNameLink}>
          {text}
        </a>
      );
    }
    const parts = input.split("|");
    if (parts.length === 2) {
      const text = parts[0].trim();
      const href = parts[1].trim();
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classNameLink}>
          {text}
        </a>
      );
    }
    return <span className={classNameText}>{input}</span>;
  }
  useEffect(() => {
    function goToFromHash() {
      if (typeof window === "undefined") return;
      const raw = window.location.hash?.slice(1);
      if (!raw) return;

      const key = decodeURIComponent(raw);
      const match = events.find(
        (e) => e.fileId === key || (Array.isArray(e.slug) ? e.slug.includes(key) : e.slug === key)
      );
      if (!match) return;

      // выставляем месяц, если нужно
      if (match.date) {
        const d = new Date(match.date);
        const target = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        setSelectedMonthYear((prev) => (prev === target ? prev : target));
      }

      // Надёжный скролл после рендера карточек
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(match.fileId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setExpandedId(match.fileId);
          loadContent(match.fileId);
        } else if (attempt < 12) {
          requestAnimationFrame(() => tryScroll(attempt + 1));
        }
      };
      requestAnimationFrame(() => tryScroll());
    }

    window.addEventListener("hashchange", goToFromHash);
    // Запускаем при первом заходе по прямой ссылке
    goToFromHash();

    return () => window.removeEventListener("hashchange", goToFromHash);
  }, [events]);
  const formatDateForGoogle = (start: string, end?: string) => {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date(s.getTime() + 60 * 60 * 1000);
    const f = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")
        .slice(0, 15) + "Z";
    return `${f(s)}/${f(e)}`;
  };

  const isCurrentMonthSelected = selectedMonthYear === monthYearOptions[0]?.value;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <Seo title={t("meta.events_title")} description={t("meta.events_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.events_title")}</h1>

      <div className={styles.articleContainer}>
        <h2 className={styles.title}>{t("months.events_title")}</h2>

        {isCurrentMonthSelected && (
          <div className={styles.introBox}>
            {isMobile ? (
              <>
                <p className={styles.introText}>{t("months.introMobile1")}</p>
                <p className={styles.introText}>{t("months.introMobile2")}</p>
              </>
            ) : (
              <>
                <p className={styles.introText}>{t("months.introPart1")}</p>
                <p className={styles.introText}>{t("months.introPart2")}</p>
                <p className={styles.introText}>
                  {t("months.introWithLink_part1")}
                  <Link href="/articles-page" className={styles.inlineLink}>
                    <span>{t("months.link_text")}</span>
                  </Link>
                  {t("months.introWithLink_part2")}
                </p>
                <p className={styles.introText4}>{t("months.introPart4")}</p>
              </>
            )}
          </div>
        )}

        {/* 🔽 Фильтр по месяцам */}
        <div className={styles.monthSelectContainer}>
          <label htmlFor="monthSelect">{t("months.filter_by_month")}</label>
          <select
            id="monthSelect"
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className={styles.monthSelect}
          >
            {monthYearOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 🔽 Список событий */}
        <div className={styles.container}>
          {filteredEvents.map((event) => {
            const fileKey = Array.isArray(event.fileId) ? event.fileId[0] : event.fileId;
            const fullHtml = eventContents[fileKey];
            const htmlToShow =
              expandedId === fileKey ? fullHtml || "<p>Loading…</p>" : event.excerptHtml || "";

            return (
              <div key={event.fileId} id={event.fileId} className={styles.eventCard}>
                <div className={styles.titleBox}>
                  <h2 className={styles.eventTitle}>{event.title}</h2>
                </div>

                <div className={styles.eventImageOrt}>
                  <div className={styles.eventLocation}>
                    {event.time && (
                      <p className={styles.box}>
                        <span className={styles.label}>{t("event.time")}*:</span>
                        <span className={styles.value}>{event.time}</span>
                      </p>
                    )}
                    {event.ort && (
                      <p className={styles.box}>
                        <span className={styles.label}>{t("event.ort")}:</span>
                        {renderMarkdownLinks(event.ort, styles.valueLink, styles.value)}
                      </p>
                    )}
                    {event.link && (
                      <p className={styles.box}>
                        <span className={styles.label}>{t("event.link")}:</span>
                        {renderMarkdownLinks(event.link, styles.valueLink, styles.value)}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window === "undefined" || !event.fileId) return;
                        const base = `${window.location.origin}/${router.locale}/events-page`;
                        const url = `${base}#${encodeURIComponent(event.fileId)}`;
                        if (navigator.clipboard && window.isSecureContext) {
                          navigator.clipboard
                            .writeText(url)
                            .then(() => {
                              setCopiedId(event.fileId);
                              setTimeout(() => setCopiedId(null), 3000);
                            })
                            .catch(console.error);
                        }
                      }}
                      className={styles.copyLinkButton}
                    >
                      {t("event.copy_link2")}
                    </button>
                  </div>

                  {event.image && (
                    <Image
                      src={event.image}
                      alt={event.imageAlt || event.title}
                      className={`${styles.eventImage} ${imageLoaded ? styles.loaded : ""}`}
                      onLoadingComplete={() => setImageLoaded(true)}
                      width={400}
                      height={200}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  )}
                </div>

                <div className={styles.eventContent}>
                  <div
                    className={styles.eventContentHtml}
                    dangerouslySetInnerHTML={{ __html: htmlToShow }}
                  />

                  <div className={styles.buttonsContainer}>
                    <div className={styles.buttonsDownload}>
                      {event.date && (
                        <>
                          <a
                            href={`/api/ics?title=${encodeURIComponent(event.title)}&description=${encodeURIComponent(
                              (fullHtml || event.excerptHtml || "").replace(/<[^>]+>/g, "")
                            )}&location=${encodeURIComponent(event.ort || "")}&start=${encodeURIComponent(
                              new Date(event.date).toISOString()
                            )}&end=${encodeURIComponent(
                              new Date(
                                event.endDate ||
                                  new Date(new Date(event.date).getTime() + 60 * 60 * 1000)
                              ).toISOString()
                            )}`}
                            className={styles.toggleButton_ics}
                          >
                            {t("event.add_to_calendar_ics")}
                          </a>

                          <a
                            href={`https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
                              event.title
                            )}&dates=${formatDateForGoogle(event.date, event.endDate)}&location=${encodeURIComponent(
                              event.ort || ""
                            )}&details=${encodeURIComponent(
                              (fullHtml || event.excerptHtml || "").replace(/<[^>]+>/g, "")
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.toggleButton_google}
                          >
                            {t("event.add_to_google_calendar")}
                          </a>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      className={styles.toggleButton}
                      onClick={() => {
                        if (expandedId === event.fileId) {
                          setExpandedId(null);
                        } else {
                          setExpandedId(event.fileId);
                          loadContent(event.fileId);
                        }
                      }}
                    >
                      {expandedId === event.fileId ? t("menu.less") : t("menu.more")}
                    </button>
                  </div>

                  <div className={styles.disclaimerBoxShort}>
                    <p className={styles.disclaimerShort}>* {t("event.disclaimer_short")}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {copiedId && <div className={styles.copyToast}>❖ {t("event.link_copied")}</div>}

        <div className={styles.monthSelectContainer}>
          <label htmlFor="monthSelect">{t("months.filter_by_month")}</label>
          <select
            id="monthSelect"
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className={styles.monthSelect}
          >
            {monthYearOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.disclaimerBox}>
          <p className={styles.disclaimer}>* {t("event.disclaimer")}</p>
        </div>
        <div className={styles.archiveLinkBox}>
          <Link href="/past-events-page" className={styles.archiveButton}>
            {t("buttons.past_events")}
          </Link>
        </div>
      </div>

      <SubscribeBox />
    </>
  );
}

// ================== SERVER SIDE ==================
export const getStaticProps: GetStaticProps<EventsProps> = async (context) => {
  const locale = context.locale || "ru";
  const raw = getEventsByLocale(locale);
  const now = new Date();

  const active = raw.filter((e) => {
    if (!e.date) return false;
    const s = new Date(e.date);
    const end = e.endDate ? new Date(e.endDate) : s;
    return end >= now;
  });

  const sorted = active.sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const { remark } = await import("remark");
  const remarkGfm = (await import("remark-gfm")).default;
  const remarkRehype = (await import("remark-rehype")).default;
  const rehypeExternalLinks = (await import("rehype-external-links")).default;
  const rehypeStringify = (await import("rehype-stringify")).default;

  async function mdToFirstParagraph(md: string): Promise<string | undefined> {
    const html = String(
      await remark()
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
        .use(rehypeStringify)
        .process(md)
    );
    const m = html.match(/<p[\s\S]*?<\/p>/i);
    return m ? m[0] : undefined;
  }

  const events: LiteEvent[] = await Promise.all(
    sorted.map(async (e) => ({
      slug: e.slug, // ← массив slug остаётся в props
      fileId: e.fileId,
      title: e.title,
      date: e.date,
      endDate: e.endDate,
      time: e.time,
      ort: e.ort,
      link: e.link,
      image: e.image,
      imageAlt: e.imageAlt,
      excerptHtml: await mdToFirstParagraph(e.content),
    }))
  );

  return { props: { events }, revalidate: 43200 };
};
