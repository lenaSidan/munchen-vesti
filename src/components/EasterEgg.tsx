"use client";
import { useEffect, useState } from "react";
import styles from "../styles/EasterEgg.module.css";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import EasterEggModal from "./EasterEggModal";

interface EasterEggProps {
  image?: string;
  rareImage?: string;
  storageKey?: string;
  sound?: string;
  chance?: number;
}

export default function EasterEgg({
  image = "/images/easter-egg-stamp.png",
  rareImage = "/images/easter-egg-gold.png",
  storageKey = "easteregg-found",
  sound = "/audio/dzyn.mp3",
  chance = 0.9, // 👈 вот это добавь

}: EasterEggProps) {
  const t = useTranslation();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: "50px", left: "50px" });
  const [showModal, setShowModal] = useState(false);
  const [eggCount, setEggCount] = useState(0);
  const [isRare, setIsRare] = useState(false);

  useEffect(() => {
    const alreadyFound = localStorage.getItem(storageKey);
    const storedCount = localStorage.getItem("easteregg-count");
    if (storedCount) setEggCount(parseInt(storedCount));
  
    if (alreadyFound === "true") return;
  
    const showEgg = () => {
      const padding = 80;
      const top = Math.floor(Math.random() * (window.innerHeight - padding * 2)) + padding;
      const left = Math.floor(Math.random() * (window.innerWidth - padding * 2)) + padding;
  
      setPosition({ top: `${top}px`, left: `${left}px` });
      setIsRare(Math.random() < 0.5);
      setVisible(true);
    };
  
    if (typeof window !== "undefined") {
      // 👉 Показывать с шансом
      if (Math.random() < (chance ?? 1)) {
        setTimeout(showEgg, 300);
      }
    }
  }, [storageKey, chance]);

  const handleClick = () => {
    const audio = new Audio(sound);
    audio.play().catch(() => {});
    const newCount = eggCount + 1;
    setEggCount(newCount);
    localStorage.setItem("easteregg-count", newCount.toString());
    localStorage.setItem(storageKey, "true");

    setShowModal(true);
    setVisible(false);
    window.dispatchEvent(new Event("easteregg-found"));
  };

  const handleCloseModal = () => setShowModal(false);
  const resetEggs = () => {
    localStorage.removeItem("easteregg-count");
    localStorage.removeItem(storageKey);
    setEggCount(0);
    setShowModal(false);
    setVisible(true);
  };

  return (
    <>
      {visible && (
        <Image
          src={isRare ? rareImage : image}
          alt={t("easteregg.alt")}
          className={`${styles.easterEgg} ${isRare ? styles.rareGlow : ""}`}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            zIndex: 9999,
          }}
          onClick={handleClick}
          width={60}
          height={60}
        />
      )}
      {showModal && <EasterEggModal onClose={handleCloseModal} onReset={resetEggs} count={eggCount} />}
    </>
  );
}
