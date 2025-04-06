import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function Seo({ title, description, image }: SeoProps) {
  const router = useRouter();
  const t = useTranslation();

  const fullTitle = title ? `${title} – ${t("meta.default_title")}` : t("meta.default_title");
  const fullDescription = description || t("meta.default_description");

  const locale = router.locale || "ru";
  const baseUrl = "https://munchen-vesti.de";
  const path = router.asPath;
  const url = `${baseUrl}${path}`;
  const imageUrl = image?.startsWith("http") ? image : `${baseUrl}${image || "/default-og-image.jpg"}`;

  const altLocale = locale === "ru" ? "de" : "ru";
  const altHref = `${baseUrl}/${altLocale}${path}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content="index, follow" />

      {/* Canonical и hreflang */}
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang={locale} href={url} />
      <link rel="alternate" hrefLang={altLocale} href={altHref} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
