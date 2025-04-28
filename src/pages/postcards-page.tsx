import Link from "next/link";
import { GetStaticProps } from "next";
import Image from "next/image";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import useTranslation from "@/hooks/useTranslation";
import Seo from "@/components/Seo";
import styles from "@/styles/PostcardsPage.module.css";

interface Postcard {
  slug: string;
  image: string;
  title: string;
}

interface PostcardsPageProps {
  postcards: Postcard[];
}


function getImageWithVersion(imagePath: string) {
  const fullPath = path.join(process.cwd(), "public", imagePath);
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
        <div className={styles.grid}>
          {postcards.map((postcard) => (
            <Link key={postcard.slug} href={`/postcards/${postcard.slug}`} className={styles.card}>
              <Image
                src={postcard.image}
                alt={postcard.title}
                width={300}
                height={200}
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
    const imagePath = `/postcards/full/${slug}.webp`;
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
