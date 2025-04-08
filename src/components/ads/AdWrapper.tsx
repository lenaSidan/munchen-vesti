import Head from "next/head";
import Seo from "@/components/Seo";

interface AdWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  image: string;
  url: string;
  type?: "LocalBusiness" | "Product" | "Service";
  additionalJsonLd?: Record<string, unknown>; // можно добавить контакт или адрес
}

export default function AdWrapper({
  children,
  title,
  description,
  image,
  url,
  type = "LocalBusiness",
  additionalJsonLd = {},
}: AdWrapperProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    image: [`https://munchen-vesti.de${image}`],
    url: `https://munchen-vesti.de${url}`,
    ...additionalJsonLd,
  };

  return (
    <>
      <Seo title={title} description={description} image={image} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      {children}
    </>
  );
}
