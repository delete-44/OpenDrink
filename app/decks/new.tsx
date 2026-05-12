import DeckForm from "@/components/decks/DeckForm";
import { StorageContext } from "@/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { useCallback, useContext, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";

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
    return (
      <ActivityIndicator color="#fff" accessibilityLabel="Loading Decks" />
    );
  }

  const currentDeck = fetchDeck(currentDeckId || ""); // If not found, returns null

  // Before deck is created
  if (!currentDeckId || !currentDeck) {
    return <DeckForm deck={workingDeck} saveDeckCallback={saveDeck} />;
  }

  return <DeckForm deck={currentDeck} saveDeckCallback={saveDeck} />;
}
