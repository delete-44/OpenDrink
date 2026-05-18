// Game logic types

import { Deck } from "./models/Deck";

export type TPayloadResponse<T> = {
  ok: boolean;
  payload?: Partial<T> | Partial<T>[];
  message?: string;
};

export type TPatchResponse = {
  ok: boolean;
  changes?: number;
  message?: string;
};

export type TDeckData = {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;

  // TODO: Remove
  cards?: string[];
};

export type TCardData = {
  id: number;
  deck_id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

export type TPlayerData = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
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
  fetchDeck: (id: number) => Deck | null;
  createDeck: (name?: string) => Promise<Deck>;
  updateDeck: (id: number, patch: Partial<Deck>) => Promise<void>;
  destroyDeck: (id: number) => Promise<void>;
  players: string[];
  savePlayers: (newPlayers: string[]) => Promise<void>;
  isLoading: boolean;
};
