import { useRouter } from "next/router";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, pathname, query } = router;

  const changeLanguage = (lang: string) => {
    router.push({ pathname, query }, undefined, { locale: lang });
  };

  return (
    <div>
      <button type="button" onClick={() => changeLanguage("ru")} disabled={locale === "ru"}>
        Русский
      </button>
      <button type="button" onClick={() => changeLanguage("de")} disabled={locale === "de"}>
        Deutsch
      </button>
    </div>
  );
};

export default LanguageSwitcher;
