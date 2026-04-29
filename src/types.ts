export type NonEmptyArray<T> = [T, ...T[]];

export type TDeck = {
  name: string;
  cards: NonEmptyArray<string>;
};

export type TPlayers = NonEmptyArray<string>;

export type GameState = {
  card: string;
  player: string;
};
