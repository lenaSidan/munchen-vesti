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
  chance?: number; // от 0 до 1, например 0.3 = 30%
}

export default function EasterEgg({
  image = "/images/easter-egg-stamp.png",
  rareImage = "/images/easter-egg-gold.png",
  storageKey = "easteregg-found",
  sound = "/audio/dzyn.mp3",
  chance = 0.9,
}: EasterEggProps) {
  const t = useTranslation();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [showModal, setShowModal] = useState(false);
  const [eggCount, setEggCount] = useState(0);
  const [isRare, setIsRare] = useState(false);

  useEffect(() => {
    const alreadyFound = localStorage.getItem(storageKey);
    const storedCount = localStorage.getItem("easteregg-count");
    const rareChance = 0.2;

    // 0.05 — примерно 1 из 20 (5%)
    // 0.1  — 10%
    // 0.2  — 20% (как сейчас)
    // 0.5  — 50% (половина всех случаев)
    // 1.0  — всегда редкая (только для теста)

    if (storedCount) setEggCount(parseInt(storedCount));

    if (alreadyFound === "true") return;

    // 👉 Способ 1: Показывать пасхалку СЛУЧАЙНО (с шансом, например 30%)
    if (Math.random() < chance) {
      // Способ 2: Показывать пасхалку ВСЕГДА (в разработке или тесте)
      //if (true) {
      setVisible(true);
      // const top = Math.floor(Math.random() * 70 + 10);
      // const left = Math.floor(Math.random() * 70 + 10);
      const top = Math.floor(Math.random() * 95 + 5);
      const left = Math.floor(Math.random() * 95 + 5);
      setPosition({ top: `${top}%`, left: `${left}%` });

      if (Math.random() < rareChance) {
        setIsRare(true);
      }
    }
  }, [chance, storageKey]);

  const handleClick = () => {
    const audio = new Audio(sound);
    audio.play().catch((err) => {
      console.warn("Audio playback error:", err);
    });

    const newCount = eggCount + 1;
    setEggCount(newCount);
    localStorage.setItem("easteregg-count", newCount.toString());
    localStorage.setItem(storageKey, "true");

    setShowModal(true);
    setVisible(false);
    window.dispatchEvent(new Event("easteregg-found"));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
          style={{ top: position.top, left: position.left }}
          onClick={handleClick}
          width={60}
          height={60}
        />
      )}

      {showModal && <EasterEggModal onClose={handleCloseModal} onReset={resetEggs} count={eggCount} />}
    </>
  );
}
