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
  saveSelectedDeckId: (id: string) => void;
  decks: Deck[];
  fetchDeck: (id: string) => Deck | null;
  saveDeck: (id: string, updatedDeck: Deck) => void;
  players: string[];
  savePlayers: (newPlayers: string[]) => void;
  isLoading: boolean;
};
