export type NonEmptyArray<T> = [T, ...T[]];

// Game logic types

export type TDeck = {
  name: string;
  cards: NonEmptyArray<string>;
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
  currentDeck: TDeck;
  currentDeckIndex: number;
  saveCurrentDeckIndex: (idx: number) => void;
  decks: TDeck[];
  saveDecks: (newDecks: TDeck[]) => void;
  players: string[];
  savePlayers: (newPlayers: string[]) => void;
  isLoading: boolean;
};
