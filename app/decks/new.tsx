import DeckForm from "@/components/decks/DeckForm";
import LoadingScreen from "@/components/status/LoadingScreen";
import { StorageContext } from "@/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { useCallback, useContext, useRef, useState } from "react";

export default function New() {
  const { createDeck, updateDeck, fetchDeck, isLoading } =
    useContext(StorageContext);

  // Store working title to prevent layout flicker when switching to the deck from storage
  const [workingDeckName, setWorkingDeckName] = useState("");
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);

  const isSaving = useRef(false);

  const workingDeck = new Deck(workingDeckName, [], currentDeckId || undefined);

  const saveDeck = useCallback(
    async (name: string) => {
      if (isSaving.current) return;

      isSaving.current = true;

      try {
        if (currentDeckId) {
          await updateDeck(currentDeckId, { name });
        } else {
          const newDeck = await createDeck(name);

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

  const currentDeck = fetchDeck(currentDeckId || ""); // If not found, returns null

  // Before deck is created
  if (!currentDeckId || !currentDeck) {
    return <DeckForm deck={workingDeck} saveDeckCallback={saveDeck} />;
  }

  return <DeckForm deck={currentDeck} saveDeckCallback={saveDeck} />;
}
