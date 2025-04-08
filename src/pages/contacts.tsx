import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import styles from "@/styles/Contacts.module.css";
import Seo from "@/components/Seo";

export default function Contacts() {
  const t = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Функция для обновления состояния формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Функция для обработки отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponseMessage(data.message);
      if (res.ok) setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      setResponseMessage(t("kontakt.section3.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo title={t("meta.contacts_title")} description={t("meta.contacts_description")} />
      <h1 className={styles.visuallyHidden}>{t("meta.contacts_title")}</h1>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("kontakt.title")}</h2>

        {/* 📍 Адрес */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("kontakt.section1.title")}</h3>
          <p className={styles.text}>{t("kontakt.section1.text")}</p>
        </div>

        {/* 📞 Контактная информация
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("kontakt.section2.title")}</h3>

          <p className={styles.text}>
            <strong>Email: </strong>
            <a href="mailto:lena.sidan75@gmail.com" className={styles.link}>
              {t("kontakt.section2.email").split(": ")[1]}
            </a>
          </p>
         <p className={styles.text}>
          <strong>Telegram: </strong>
          <a href="https://t.me/example" target="_blank" rel="noopener noreferrer" className={styles.link}>
            {t("kontakt.section2.telegram").split(": ")[1]}
          </a>
        </p> 
        </div> */}

        {/* 📩 Форма обратной связи */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t("kontakt.section3.title")}</h3>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <label>
              {t("kontakt.section3.form_name")}
              <input
                type="text"
                name="name"
                required
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              {t("kontakt.section3.form_email")}
              <input
                type="email"
                name="email"
                required
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              {t("kontakt.section3.form_message")}
              <textarea
                name="message"
                required
                className={styles.textarea}
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </label>

            {/* 🔹 Декоративные элементы + кнопка отправки */}
            <div className={styles.readMoreContainer}>
              <div className={styles.decorativeLine}>
                <span className={styles.left}>⊱❧</span>
                <span className={styles.right}>⊱❧</span>
              </div>

              <button type="submit" className={styles.readMore} disabled={isSubmitting}>
                {isSubmitting ? t("kontakt.section3.sending") : t("kontakt.section3.form_submit")}
              </button>

              <div className={`${styles.decorativeLine} ${styles.bottom}`}>
                <span className={styles.right}>⊱❧</span>
                <span className={styles.left}>⊱❧</span>
              </div>
            </div>

            {/* Вывод сообщения об отправке */}
            {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
