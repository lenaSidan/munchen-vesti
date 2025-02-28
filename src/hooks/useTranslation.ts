import { useRouter } from "next/router";
import { useMemo } from "react";
import ru from "../locales/ru.json";
import de from "../locales/de.json";

type TranslationObject = { [key: string]: string | TranslationObject };
const translations: Record<string, TranslationObject> = { ru, de };

export default function useTranslation() {
  const router = useRouter();
  const locale = router?.locale ?? "ru"; // Если `useRouter()` не доступен, используем "ru"

  const currentTranslations = useMemo(() => translations[locale] || translations["ru"], [locale]);

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
