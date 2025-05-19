import LikeButton from "@/components/LikeButton";
import Seo from "@/components/Seo";
import SocialLinks from "@/components/SocialLinks";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/PostcardsPage.module.css";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";

interface Postcard {
  slug: string;
  image: string;
  title: string;
}

interface PostcardsPageProps {
  postcards: Postcard[];
}

function getImageWithVersion(imagePath: string) {
  const fullPath = path.join(process.cwd(), "public", imagePath.replace(/^\/+/, ""));
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const timestamp = stats.mtime.getTime();
    return `${imagePath}?v=${timestamp}`;
  }
  return imagePath;
}

export default function PostcardsPage({ postcards }: PostcardsPageProps) {
  const t = useTranslation();

  return (
    <>
      <Seo title={t("meta.postcards_title")} description={t("meta.postcards_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.postcardsAll_title")}</h1>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("postcards.title")}</h2>
        <div className={styles.intro}>
          <p className={styles.subtitle}>{t("postcards.subtitle")}</p>
          <p className={styles.descriptionText}>{t("postcards.description")}</p>
   
        </div>
<div  className={styles.socialLinks}>
        <SocialLinks />
      </div>
        <div className={styles.grid}>
          {postcards.map((postcard) => (
            <Link key={postcard.slug} href={`/postcards/${postcard.slug}`} className={styles.card}>
              <Image
                src={postcard.image}
                alt={postcard.title}
                width={550}
                height={334}
                className={styles.image}
              />
              <div className={styles.cardTitle}>{postcard.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostcardsPageProps> = async ({ locale }) => {
  const dir = path.join(process.cwd(), "public/postcards-md");
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(`.${locale}.md`));

  const postcards: Postcard[] = files.map((file) => {
    const slug = file.replace(`.${locale}.md`, "");
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    // Генерация пути к картинке с автоматической версией
    const imagePath = data.image || `/postcards/full/${slug}.webp`;
    const versionedImage = getImageWithVersion(imagePath);

    return {
      slug,
      image: versionedImage,
      title: data.title || slug,
    };
  });

  return {
    props: {
      postcards,
    },
  };
};
