import { Deck } from "@/src/models/Deck";

export const BaseTestDeck = new Deck("Test Deck", ["Card 1"]);

export const BaseTestPlayers = ["Sally", "Alice"];

export const BaseMockStorageContext = {
  selectedDeck: BaseTestDeck,
  saveSelectedDeckId: jest.fn(),
  decks: [BaseTestDeck],
  fetchDeck: jest.fn(),
  saveDeck: jest.fn(),
  players: BaseTestPlayers,
  savePlayers: jest.fn(),
  isLoading: false,
};
