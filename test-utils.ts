import { DeckFactory } from "./factories/models/DeckFactory";
import { PlayerFactory } from "./factories/models/PlayerFactory";

export const BaseTestPlayers = [
  PlayerFactory({ id: 1, name: "Sally" }),
  PlayerFactory({ id: 2, name: "Alice" }),
];

const _deck = DeckFactory();

export const BaseMockStorageContext = {
  selectedDeck: _deck,
  saveSelectedDeckIdx: jest.fn(),
  decks: [_deck],
  fetchDeck: jest.fn(),
  createDeck: jest.fn(),
  updateDeck: jest.fn(),
  destroyDeck: jest.fn(),
  deckCards: [],
  players: BaseTestPlayers,
  createPlayer: jest.fn(),
  deletePlayer: jest.fn(),
  isLoading: false,
};
