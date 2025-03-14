import { useRouter } from "next/router";
import { useMemo } from "react";
import ru from "../locales/ru.json";
import de from "../locales/de.json";

type TranslationObject = { [key: string]: string | TranslationObject };
const translations: Record<string, TranslationObject> = { ru, de };

export default function useTranslation() {
  const router = useRouter();
  const locale = router?.locale ?? "ru"; // Если `useRouter()` не доступен, используем "ru"

  // Мемоизируем переводы
  const currentTranslations = useMemo(
    () => translations[locale] || translations["ru"],
    [locale]
  );

  // Функция поиска перевода по ключу
  const t = (key: string): string => {
    const keys = key.split(".");
    let result: string | TranslationObject = currentTranslations;

    for (const k of keys) {
      if (typeof result === "object" && result !== null && k in result) {
        result = result[k];
      } else {
        console.warn(`Перевод не найден для ключа: ${key}`);
        return key; // Если ключ не найден, возвращаем сам ключ
      }
    }

    return typeof result === "string" ? result : key;
  };

  return t;
}
