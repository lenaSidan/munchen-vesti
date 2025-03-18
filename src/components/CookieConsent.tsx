import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import useTranslation from "@/hooks/useTranslation";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import styles from "@/styles/CookieConsent.module.css";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    if (!Cookies.get("cookieConsent")) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setIsVisible(false);
  };

  const declineCookies = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={styles.cookieOverlay} />

      <div className={styles.cookieBanner}>
        <p>
          {t("cookieConsent.message")}{" "}
          <a href="#" onClick={() => setIsPrivacyOpen(true)} className={styles.learnMore}>
            {t("cookieConsent.learnMore")}
          </a>
        </p>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={acceptCookies} className={styles.acceptButton}>
            {t("cookieConsent.accept")}
          </button>
          <button type="button" onClick={declineCookies} className={styles.declineButton}>
            {t("cookieConsent.decline")}
          </button>
        </div>
      </div>

      {isPrivacyOpen && <PrivacyPolicyModal onClose={() => setIsPrivacyOpen(false)} />}
    </>
  );
}
