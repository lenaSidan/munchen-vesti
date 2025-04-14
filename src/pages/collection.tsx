import EasterEggCollection from "@/components/EasterEggCollection";
import Seo from "@/components/Seo";
import useTranslation from "@/hooks/useTranslation";

export default function CollectionPage() {
  const t = useTranslation();

  return (
    <>
      <Seo
        title={t("eastereggCollection.title")}
        description={t("eastereggCollection.description")}
      />
      <EasterEggCollection />
    </>
  );
}
