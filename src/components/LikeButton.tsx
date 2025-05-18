import styles from "@/styles/LikeButton.module.css";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../firebase";

type LikeButtonProps = {
  slug: string;
};

export default function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const hasLiked = localStorage.getItem(`liked-${slug}`);
    if (hasLiked === "true") setClicked(true);

    const fetchLikes = async () => {
      const docRef = doc(db, "likes", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLikes(docSnap.data().count || 0);
      } else {
        // Если документа нет, создаём
        await setDoc(docRef, { count: 0 });
        setLikes(0);
      }
    };

    fetchLikes();
  }, [slug]);

  const handleClick = async () => {
    if (clicked) return;

    const docRef = doc(db, "likes", slug);
    await updateDoc(docRef, {
      count: increment(1),
    });

    setLikes((prev) => prev + 1);
    setClicked(true);
    localStorage.setItem(`liked-${slug}`, "true");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={clicked}
      className={`${styles.likeButton} ${clicked ? styles.clicked : ""}`}
    >
      <Image
        src={clicked ? "/icons/heart-filled.png" : "/icons/heart_empty.png"}
        alt="Like"
        width={20}
        height={20}
        className={styles.heartImage}
      />
      <span className={styles.count}>{likes ?? "…"}</span>
    </button>
  );
}
