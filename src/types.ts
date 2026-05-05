// Game logic types

import { Deck } from "./models/Deck";

export type TDeck = {
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
  currentDeck: Deck;
  currentDeckIndex: number;
  saveCurrentDeckIndex: (idx: number) => void;
  decks: Deck[];
  saveDeck: (idx: number, updatedDeck: Deck) => void;
  players: string[];
  savePlayers: (newPlayers: string[]) => void;
  isLoading: boolean;
};
