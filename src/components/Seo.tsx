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
  const imageUrl = image || "/default-og-image.jpg";
  const url = `https://munchen-vesti.de${router.asPath}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
    </Head>
  );
}
