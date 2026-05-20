import { Deck } from "@/src/models/Deck";
import { StorageContextProps, StorageProviderProps } from "@/src/types";
import { useSQLiteContext } from "expo-sqlite";
import Storage from "expo-sqlite/kv-store";
import { createContext, useEffect, useMemo, useState } from "react";
import { Player } from "../models/Player";
import { CardRepository } from "../repositories/CardRepository";
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

export function StorageProvider({ children }: StorageProviderProps) {
  const [selectedDeckIdx, setSelectedDeckIdx] = useState<number>(0);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const db = useSQLiteContext();

  useEffect(() => {
    const init = () => {
      PlayerRepository.initialise(db);
      DeckRepository.initialise(db);
      CardRepository.initialise(db);
    };

    const fetchData = async () => {
      const [loadedSelectedDeckIdx, loadedDecks, loadedPlayers] =
        await Promise.all([
          Storage.getItemAsync(SELECTED_DECK_KEY),
          DeckRepository.index(),
          PlayerRepository.index(),
        ]);

      setSelectedDeckIdx(
        loadedSelectedDeckIdx ? JSON.parse(loadedSelectedDeckIdx) : 0,
      );
      setDecks(loadedDecks.payload);
      setPlayers(loadedPlayers.payload);

      setIsLoading(false);
    };

    init();
    fetchData();
  }, [db]);

  const selectedDeck = useMemo(() => {
    return decks[selectedDeckIdx] || decks[0];
  }, [decks, selectedDeckIdx]);

  const saveSelectedDeckIdx = async (idx: number) => {
    await Storage.setItemAsync(SELECTED_DECK_KEY, JSON.stringify(idx));

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
    players,
    createPlayer,
    deletePlayer,
    isLoading,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}
