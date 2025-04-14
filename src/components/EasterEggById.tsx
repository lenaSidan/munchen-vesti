import EasterEgg from "./EasterEgg";
import { EASTER_EGGS } from "@/data/easterEggs";

interface Props {
  id: string;
  chance?: number;
}

export default function EasterEggById({ id, chance = 0.3 }: Props) {
  const egg = EASTER_EGGS.find((egg) => egg.id === id);

  if (!egg) return null;

  return (
    <EasterEgg
      image={egg.image}
      rareImage={egg.rareImage}
      storageKey={egg.id}
      chance={chance}
    />
  );
}