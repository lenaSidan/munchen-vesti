import { useRouter } from "next/router";
import { useMemo } from "react";
import ru from "../locales/ru.json";
import de from "../locales/de.json";

type TranslationObject = { [key: string]: string | TranslationObject };
const translations: Record<string, TranslationObject> = { ru, de };

export default function useTranslation() {
  const router = useRouter();
  const locale = router?.locale ?? "ru";

  const currentTranslations = useMemo(
    () => translations[locale] || translations["ru"],
    [locale]
  );

  const t = (key: string, variables?: Record<string, string>): string => {
    const keys = key.split(".");
    let result: string | TranslationObject = currentTranslations;

    for (const k of keys) {
      if (typeof result === "object" && result !== null && k in result) {
        result = result[k];
      } else {
        console.warn(`Перевод не найден для ключа: ${key}`);
        return key;
      }
    }

    if (typeof result === "string") {
      // Интерполяция {{var}}
      if (variables) {
        return result.replace(/\{\{(.*?)\}\}/g, (_, varName) =>
          variables[varName.trim()] ?? ""
        );
      }
      return result;
    }

    return key;
  };

  return t;
}
