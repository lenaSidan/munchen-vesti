"use client";

import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/LegalAdviceBlock.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UsefulItemLite {
  slug: string;
  title: string;
  summaryHtml?: string;
  fileId?: string | string[];
  category?: string | string[];
}

interface LegalAdviceBlockProps {
  limit?: number;
}

export default function LegalAdviceBlock({ limit = 1 }: LegalAdviceBlockProps) {
  const [items, setItems] = useState<UsefulItemLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { locale } = useRouter();
  const t = useTranslation();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/useful-legal?locale=${locale || "ru"}&limit=${limit}`);

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data: UsefulItemLite[] = await res.json();
        setItems(data);
      } catch (e: any) {
        console.error("Failed to load legal advice:", e);
        setError("failed");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [locale, limit]);

  if (loading) return null;
  if (error || !items.length) return null;

  const item = items[0];

  return (
    <div className={styles.legalBlock}>
      <h3 className={styles.legalTitle}>{t("legal.legal_advice_title")}</h3>
      <div className={styles.legalBlockContainer}>
        {item && (
          <div className={styles.legalItem}>
            <div className={styles.legalContent}>
              <h4 className={styles.legalItemTitle}>{item.title}</h4>

              {item.summaryHtml && (
                <div
                  className={styles.legalSummary}
                  dangerouslySetInnerHTML={{ __html: item.summaryHtml }}
                />
              )}
            </div>

            <Link href={`/useful/${item.slug}`} className={styles.readMore}>
              {t("mobileHighlight.read_more")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
