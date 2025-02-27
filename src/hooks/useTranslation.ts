import { useRouter } from "next/router";
import ru from "../locales/ru.json";
import de from "../locales/de.json";

type TranslationObject = { [key: string]: string | TranslationObject };
const translations: Record<string, TranslationObject> = { ru, de };

export default function useTranslation() {
  const { locale } = useRouter();
  const currentTranslations = translations[locale ?? "ru"];

  return (key: string): string => {
    const keys = key.split(".");

    let result: string | TranslationObject = currentTranslations;

    for (const k of keys) {
      if (typeof result === "object" && result !== null && k in result) {
        result = result[k];
      } else {
        return key; // Вернём ключ, если перевод не найден
      }
    }

    return typeof result === "string" ? result : key;
  };
}
