import DEFAULT_DECK from "@/src/constants/default-deck";
import { Deck } from "@/src/models/Deck";
import { StorageContextProps, StorageProviderProps } from "@/src/types";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useMemo, useState } from "react";

export const StorageContext = createContext({} as StorageContextProps);

const SELECTED_DECK_KEY = "selected_deck_id";
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
  const [selectedDeckId, setSelectedDeckId] = useState<string>();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [loadedSelectedDeckId, loadedDecks, loadedPlayers] =
        await Promise.all([
          loadResourceImpl(SELECTED_DECK_KEY, ""),
          loadResourceImpl(DECK_KEY, [DEFAULT_DECK]),
          loadResourceImpl(PLAYER_KEY, [] as string[]),
        ]);

      setSelectedDeckId(loadedSelectedDeckId);
      setDecks(loadedDecks.map((deckData) => Deck.fromJson(deckData)));
      setPlayers(loadedPlayers);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const selectedDeck = useMemo(() => {
    return decks.find((d) => d.id === selectedDeckId) || decks[0];
  }, [decks, selectedDeckId]);

  const saveSelectedDeckId = async (id: string) => {
    await saveResourceImpl(SELECTED_DECK_KEY, id);
    setSelectedDeckId(id);
  };

  const fetchDeck = (id: string) => {
    return decks.find((d) => d.id === id) || null;
  };

  const createDeck = async (name = "" as string): Promise<Deck> => {
    const newDeck = new Deck(name, []);
    const newDecks = [...decks, newDeck];

    await saveResourceImpl(DECK_KEY, newDecks);
    setDecks(newDecks);

    return newDeck;
  };

  const updateDeck = async (id: string, updatedDeck: Deck) => {
    const newDecks = decks.map((deck) => (deck.id === id ? updatedDeck : deck));

    await saveResourceImpl(DECK_KEY, newDecks);
    setDecks(newDecks);
  };

  const savePlayers = async (newPlayers: string[]) => {
    await saveResourceImpl(PLAYER_KEY, newPlayers);
    setPlayers(newPlayers);
  };

  const value = {
    selectedDeck,
    saveSelectedDeckId,
    decks,
    fetchDeck,
    createDeck,
    updateDeck,
    players,
    savePlayers,
    isLoading,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}
