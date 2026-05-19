import { Deck } from "@/src/models/Deck";
import { StorageContextProps, StorageProviderProps } from "@/src/types";
import * as SecureStore from "expo-secure-store";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useEffect, useMemo, useState } from "react";
import { Card } from "../models/Card";
import { Player } from "../models/Player";
import {
  CardPermittedFields,
  CardRepository,
} from "../repositories/CardRepository";
import {
  DeckPermittedFields,
  DeckRepository,
} from "../repositories/DeckRepository";
import {
  PlayerPermittedFields,
  PlayerRepository,
} from "../repositories/PlayerRepository";

export const StorageContext = createContext({} as StorageContextProps);

const SELECTED_DECK_KEY = "selected_deck_idx";
const DECK_KEY = "decks";

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
  const [selectedDeckIdx, setSelectedDeckIdx] = useState<number>(0);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckCards, setDeckCards] = useState<Card[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const db = useSQLiteContext();

  const selectedDeck = useMemo(() => {
    return decks[selectedDeckIdx] || decks[0];
  }, [decks, selectedDeckIdx]);

  // Load cards whenever selected deck changes
  useEffect(() => {
    if (!selectedDeck) return;

    const loadCards = async () => {
      try {
        const cards = selectedDeck.ncards();
        setDeckCards(cards);
      } catch (err) {
        console.error("Failed to load cards:", err);
        setDeckCards([]);
      }
    };

    loadCards();
  }, [selectedDeck]);

  useEffect(() => {
    const init = () => {
      PlayerRepository.initialise(db);
      DeckRepository.initialise(db);
      CardRepository.initialise(db);
    };

    const fetchData = async () => {
      const [loadedSelectedDeckIdx, loadedDecks, loadedPlayers] =
        await Promise.all([
          loadResourceImpl(SELECTED_DECK_KEY, 0),
          DeckRepository.index(),
          PlayerRepository.index(),
        ]);

      setSelectedDeckIdx(loadedSelectedDeckIdx);
      setDecks(loadedDecks.payload || []);
      setPlayers(loadedPlayers.payload || []);

      setIsLoading(false);
    };

    init();
    fetchData();
  }, [db]);

  const saveSelectedDeckIdx = async (idx: number) => {
    await saveResourceImpl(SELECTED_DECK_KEY, idx);
    setSelectedDeckIdx(idx);
  };

  const fetchDeck = (id: number) => {
    return decks.find((d) => d.id === id) || null;
  };

  const createDeck = async (patch: DeckPermittedFields): Promise<Deck> => {
    const resp = await DeckRepository.create(patch);

    if (!resp.ok || !resp.payload) {
      throw new Error(resp.message);
    }

    const newDecks = [...decks, resp.payload!];

    setDecks(newDecks);

    return resp.payload;
  };

  const updateDeck = async (id: number, patch: DeckPermittedFields) => {
    const resp = await DeckRepository.update(id, patch);

    if (resp.changes === 0 || !resp.ok) {
      throw new Error(resp.message);
    }

    const newDecks = decks.map((deck) =>
      deck.id === id ? new Deck({ ...deck, ...patch }) : deck,
    );

    await saveResourceImpl(DECK_KEY, newDecks);
    setDecks(newDecks);
  };

  const destroyDeck = async (id: number) => {
    const resp = await DeckRepository.delete(id);

    if (resp.changes === 0 || !resp.ok) {
      throw new Error(resp.message);
    }

    const newDecks = decks.filter((deck) => deck.id !== id);
    setDecks(newDecks);
  };

  const createCard = async (deckId: number, patch: CardPermittedFields) => {
    const resp = await CardRepository.create(deckId, patch);

    if (!resp.ok || !resp.payload) {
      throw new Error(resp.message);
    }

    const newDeckCards = [...deckCards, resp.payload];

    setDeckCards(newDeckCards);
  };

  // createCard
  // destroyCard
  // create many cards

  const createPlayer = async (patch: PlayerPermittedFields) => {
    const resp = await PlayerRepository.create(patch);

    if (!resp.ok || !resp.payload) {
      throw new Error(resp.message);
    }

    const newPlayers = [...players, resp.payload!];

    setPlayers(newPlayers);
  };

  const deletePlayer = async (id: number) => {
    const resp = await PlayerRepository.delete(id);

    if (resp.changes === 0 || !resp.ok) {
      throw new Error(resp.message);
    }

    const newPlayers = players.filter((player) => player.id !== id);
    setPlayers(newPlayers);
  };

  const value = {
    selectedDeck,
    saveSelectedDeckIdx,
    decks,
    fetchDeck,
    createDeck,
    updateDeck,
    destroyDeck,
    deckCards,
    createCard,
    players,
    createPlayer,
    deletePlayer,
    isLoading,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}
