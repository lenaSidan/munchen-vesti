import Head from "next/head";
import Seo from "@/components/Seo";

interface AdWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  url: string;
  type?: "LocalBusiness" | "Product" | "Service";
  additionalJsonLd?: Record<string, unknown>;
}

export default function AdWrapper({
  children,
  title,
  description,
  url,
  type = "LocalBusiness",
  additionalJsonLd = {},
}: AdWrapperProps) {
  const imageUrl = "https://munchen-vesti.de/images/og-card.png"; // 💳 всегда визитка

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    image: [imageUrl],
    url: `https://munchen-vesti.de${url}`,
    ...additionalJsonLd,
  };

  return (
    <>
      <Seo title={title} description={description} />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      {children}
    </>
  );
}
