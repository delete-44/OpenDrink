// Game logic types

import { Card } from "./models/Card";
import { Deck } from "./models/Deck";
import { Player } from "./models/Player";
import { DeckPermittedFields } from "./repositories/DeckRepository";
import { PlayerPermittedFields } from "./repositories/PlayerRepository";

type ResponseMeta = {
  ok: boolean;
  message?: string;
};

export type TItemResponse<T> = ResponseMeta & {
  payload?: T;
};

export type TCollectionResponse<T> = ResponseMeta & {
  payload: T[];
};

export type TPartialResponse<T> = ResponseMeta & {
  payload?: Partial<T>;
};

export type TPatchResponse = ResponseMeta & {
  changes?: number;
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

export type GameState = {
  card: string;
  player: Player;
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
  createDeck: (patch: DeckPermittedFields) => Promise<Deck>;
  updateDeck: (id: number, patch: DeckPermittedFields) => Promise<void>;
  destroyDeck: (id: number) => Promise<void>;
  deckCards: Card[];
  players: Player[];
  createPlayer: (patch: PlayerPermittedFields) => Promise<void>;
  deletePlayer: (id: number) => Promise<void>;
  isLoading: boolean;
};
