import DEFAULT_DECK from "@/src/constants/default-deck";
import { Deck } from "@/src/models/Deck";
import { StorageContextProps, StorageProviderProps } from "@/src/types";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useMemo, useState } from "react";

export const StorageContext = createContext({} as StorageContextProps);

const CURRENT_DECK_KEY = "current_deck_idx";
const DECK_KEY = "decks";
const PLAYER_KEY = "players";

export async function loadResourceImpl<T>(
  storageKey: string,
  fallback: T,
): Promise<T> {
  try {
    const data = await SecureStore.getItemAsync(storageKey);

    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    // TODO: Error handling
    console.error("Failed to load data: ", error);

    return fallback;
  }
}

export async function saveResourceImpl<T>(
  storageKey: string,
  newVal: T,
): Promise<void> {
  try {
    await SecureStore.setItemAsync(storageKey, JSON.stringify(newVal));
  } catch (error) {
    // TODO: Error handling
    console.error(`Failed to save ${storageKey}:`, error);
  }
}

export function StorageProvider({ children }: StorageProviderProps) {
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [loadedCurrentDeckIndex, loadedDecks, loadedPlayers] =
        await Promise.all([
          loadResourceImpl(CURRENT_DECK_KEY, 0),
          loadResourceImpl(DECK_KEY, [DEFAULT_DECK]),
          loadResourceImpl(PLAYER_KEY, [] as string[]),
        ]);

      setCurrentDeckIndex(loadedCurrentDeckIndex);
      setDecks(loadedDecks.map((deckData) => Deck.fromJson(deckData)));
      setPlayers(loadedPlayers);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const currentDeck = useMemo(() => {
    return decks[currentDeckIndex] || decks[0];
  }, [decks, currentDeckIndex]);

  const saveCurrentDeckIndex = async (idx: number) => {
    await saveResourceImpl(CURRENT_DECK_KEY, idx);
    setCurrentDeckIndex(idx);
  };

  const _saveDecks = async (newDecks: Deck[]) => {
    await saveResourceImpl(DECK_KEY, newDecks);
    setDecks(newDecks);
  };

  const saveDeck = async (deckIdx: number, updatedDeck: Deck) => {
    const newDecks = decks.map((deck, idx) =>
      idx === deckIdx ? updatedDeck : deck,
    );

    await _saveDecks(newDecks);
  };

  const savePlayers = async (newPlayers: string[]) => {
    await saveResourceImpl(PLAYER_KEY, newPlayers);
    setPlayers(newPlayers);
  };

  const value = {
    currentDeck,
    currentDeckIndex,
    saveCurrentDeckIndex,
    decks,
    saveDeck,
    players,
    savePlayers,
    isLoading,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}
