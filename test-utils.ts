import { Deck } from "@/src/models/Deck";

export const BaseTestDeck = new Deck("Test Deck", ["Card 1"]);

export const BaseTestPlayers = ["Sally", "Alice"];

export const BaseMockStorageContext = {
  selectedDeck: BaseTestDeck,
  saveSelectedDeckIdx: jest.fn(),
  decks: [BaseTestDeck],
  fetchDeck: jest.fn(),
  createDeck: jest.fn(),
  saveDeck: jest.fn(),
  players: BaseTestPlayers,
  savePlayers: jest.fn(),
  isLoading: false,
};
