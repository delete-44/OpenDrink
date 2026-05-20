import DeckForm from "@/src/components/decks/DeckForm";
import LoadingScreen from "@/src/components/status/LoadingScreen";
import { CardProvider } from "@/src/context/CardContext";
import { StorageContext } from "@/src/context/StorageContext";
import { useCallback, useContext, useRef, useState } from "react";

export default function New() {
  const { createDeck, updateDeck, fetchDeck, isLoading } =
    useContext(StorageContext);

  // Store working title to prevent layout flicker when switching to the deck from storage
  const [workingDeckName, setWorkingDeckName] = useState("");
  const [currentDeckId, setCurrentDeckId] = useState<number | null>(null);

  const isSaving = useRef(false);

  const saveDeck = useCallback(
    async (name: string) => {
      if (isSaving.current) return;

      isSaving.current = true;

      try {
        if (currentDeckId) {
          await updateDeck(currentDeckId, { name });
        } else {
          const newDeck = await createDeck({ name });

          setWorkingDeckName(name);
          setCurrentDeckId(newDeck.id);
        }
      } finally {
        isSaving.current = false;
      }
    },
    [createDeck, currentDeckId, updateDeck],
  );

  if (isLoading) {
    return <LoadingScreen label="Loading Deck" />;
  }

  const currentDeck = fetchDeck(currentDeckId || -1); // If not found, returns null

  // Before deck is created
  if (!currentDeckId || !currentDeck) {
    return (
      <CardProvider deck={null}>
        <DeckForm
          // We provide a stub Deck object containing just the WIP name
          // This is to prevent the UI flickering in the split-second where
          // we commit the deck to the DB. Therefore:
          // @ts-expect-error
          deck={{ name: workingDeckName }}
          saveDeckCallback={saveDeck}
        />
      </CardProvider>
    );
  }

  return (
    <CardProvider deck={currentDeck}>
      <DeckForm deck={currentDeck} saveDeckCallback={saveDeck} />
    </CardProvider>
  );
}
