// Game logic types

import { Deck } from "./models/Deck";

export type TDeckData = {
  id: string;
  name: string;
  cards: string[];
};

export type TPlayers = string[];

export type GameState = {
  card: string;
  player: string;
};

// StorageContext types

export type StorageProviderProps = {
  children: any;
};

export type StorageContextProps = {
  selectedDeck: Deck;
  saveSelectedDeckIdx: (idx: number) => Promise<void>;
  decks: Deck[];
  fetchDeck: (id: string) => Deck | null;
  createDeck: (name?: string) => Promise<Deck>;
  updateDeck: (id: string, patch: Partial<Deck>) => Promise<void>;
  players: string[];
  savePlayers: (newPlayers: string[]) => Promise<void>;
  isLoading: boolean;
};
