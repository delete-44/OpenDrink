import { DeckFactory } from "./factories/models/DeckFactory";

export const BaseTestPlayers = ["Sally", "Alice"];

const _deck = DeckFactory();

export const BaseMockStorageContext = {
  selectedDeck: _deck,
  saveSelectedDeckIdx: jest.fn(),
  decks: [_deck],
  fetchDeck: jest.fn(),
  createDeck: jest.fn(),
  updateDeck: jest.fn(),
  destroyDeck: jest.fn(),
  players: BaseTestPlayers,
  savePlayers: jest.fn(),
  isLoading: false,
};
