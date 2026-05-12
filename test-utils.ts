import { Deck } from "@/src/models/Deck";

export const BaseTestDeck = new Deck("Test Deck", ["Card 1"], "abc123");

export const BaseTestPlayers = ["Sally", "Alice"];

export const BaseMockStorageContext = {
  selectedDeck: BaseTestDeck,
  saveSelectedDeckIdx: jest.fn(),
  decks: [BaseTestDeck],
  fetchDeck: jest.fn(),
  createDeck: jest.fn(),
  updateDeck: jest.fn(),
  destroyDeck: jest.fn(),
  players: BaseTestPlayers,
  savePlayers: jest.fn(),
  isLoading: false,
};
