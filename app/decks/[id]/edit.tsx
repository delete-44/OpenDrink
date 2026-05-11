import DeckForm from "@/components/decks/DeckForm";
import { useDeckFromLayout } from "@/context/DeckLayoutContext";
import { StorageContext } from "@/context/StorageContext";
import { useCallback, useContext } from "react";

export default function Edit() {
  const { updateDeck } = useContext(StorageContext);
  const currentDeck = useDeckFromLayout();

  const saveDeck = useCallback(
    async (name: string) => {
      await updateDeck(currentDeck.id, { name: name });
    },
    [currentDeck, updateDeck],
  );

  return <DeckForm deck={currentDeck} saveDeckCallback={saveDeck} />;
}
